"""Contact notifications. Runs as a background task: a failure here never loses the stored message."""

import logging
import smtplib
from email.message import EmailMessage

import httpx

from app.config import Settings

log = logging.getLogger("portfolio.email")


def _compose(name: str, email: str, message: str, locale: str) -> tuple[str, str]:
    subject = f"[Portfolio] New message from {name}"
    body = f"From: {name} <{email}>\nLocale: {locale}\n\n{message}\n"
    return subject, body


def notify_contact(settings: Settings, *, name: str, email: str, message: str, locale: str) -> None:
    if not settings.notify_email:
        log.info("NOTIFY_EMAIL not set; skipping notification for message from %s", email)
        return
    subject, body = _compose(name, email, message, locale)
    try:
        if settings.resend_api_key:
            r = httpx.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={
                    "from": settings.resend_from,
                    "to": [settings.notify_email],
                    "reply_to": email,
                    "subject": subject,
                    "text": body,
                },
                timeout=10,
            )
            r.raise_for_status()
        elif settings.smtp_host:
            msg = EmailMessage()
            msg["From"] = settings.smtp_user or settings.notify_email
            msg["To"] = settings.notify_email
            msg["Reply-To"] = email
            msg["Subject"] = subject
            msg.set_content(body)
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as s:
                s.starttls()
                if settings.smtp_user:
                    s.login(settings.smtp_user, settings.smtp_password)
                s.send_message(msg)
        else:
            log.info("No email transport configured. New contact message:\n%s", body)
            return
        log.info("Notification sent for message from %s", email)
    except Exception:
        log.exception("Failed to send contact notification (message is stored in the DB)")
