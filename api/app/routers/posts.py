from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Post
from app.schemas import Locale, PostOut

router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.get("", response_model=list[PostOut])
def list_posts(locale: Locale | None = Query(default=None), db: Session = Depends(get_db)) -> list[Post]:
    stmt = select(Post).where(Post.published.is_(True)).order_by(Post.published_at.desc())
    if locale:
        stmt = stmt.where(Post.locale == locale)
    return list(db.scalars(stmt))


@router.get("/{slug}", response_model=PostOut)
def get_post(slug: str, locale: Locale = Query(default="en"), db: Session = Depends(get_db)) -> Post:
    post = db.scalar(select(Post).where(Post.slug == slug, Post.locale == locale, Post.published.is_(True)))
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
