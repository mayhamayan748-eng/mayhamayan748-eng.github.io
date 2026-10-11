import logging

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.models import ContactMessage
from app.ratelimit import client_ip, hash_ip, limiter
from app.schemas import ContactIn, ContactOut
from app.services.email import notify_contact

router = APIRouter(prefix="/api", tags=["contact"])
log = logging.getLogger("portfolio.contact")


@router.post("/contact", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
@limiter.limit(lambda: get_settings().contact_rate_limit)
def create_contact(
    request: Request,
    payload: ContactIn,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> ContactOut:
    if payload.website:
        # Honeypot tripped: pretend success so bots learn nothing, store nothing.
        log.info("Honeypot triggered; dropping submission")
        return ContactOut()

    msg = ContactMessage(
        name=payload.name,
        email=str(payload.email),
        message=payload.message,
        locale=payload.locale,
        ip_hash=hash_ip(client_ip(request)),
        user_agent=(request.headers.get("user-agent") or "")[:300] or None,
    )
    db.add(msg)
    db.commit()

    background.add_task(
        notify_contact, settings, name=msg.name, email=msg.email, message=msg.message, locale=msg.locale
    )
    return ContactOut()
