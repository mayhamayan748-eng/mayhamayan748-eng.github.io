"""Upsert blog posts from Markdown files with a small front-matter header.

Usage:
    python -m scripts.seed_posts path/to/posts/*.md

File format (the body below the second --- is Markdown):
    ---
    slug: yolo-false-positive-budgets
    locale: en            # en | ar
    title: False-positive budgets for PPE detection
    summary: Why precision beats recall at the margin.
    tags: computer-vision, yolo
    group: fp-budgets     # same value for the EN and AR versions
    published: true
    date: 2026-10-01
    cover: https://res.cloudinary.com/...   # optional
    ---
    # Markdown body...
"""

import sys
from datetime import UTC, datetime
from pathlib import Path

from sqlalchemy import select

from app.db import SessionLocal
from app.models import Post


def parse(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise ValueError(f"{path}: missing front matter")
    _, header, body = text.split("---", 2)
    meta = {}
    for line in header.strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.split("#")[0].strip() if key.strip() != "cover" else value.strip()
    return meta, body.strip()


def upsert(path: Path) -> str:
    meta, body = parse(path)
    with SessionLocal() as db:
        post = db.scalar(select(Post).where(Post.slug == meta["slug"], Post.locale == meta.get("locale", "en")))
        if post is None:
            post = Post(slug=meta["slug"], locale=meta.get("locale", "en"))
            db.add(post)
        post.title = meta["title"]
        post.summary = meta.get("summary", "")
        post.body_md = body
        post.tags = [t.strip() for t in meta.get("tags", "").split(",") if t.strip()]
        post.cover_url = meta.get("cover") or None
        post.translation_group = meta.get("group") or None
        post.published = meta.get("published", "false").lower() == "true"
        if meta.get("date"):
            post.published_at = datetime.fromisoformat(meta["date"]).replace(tzinfo=UTC)
        elif post.published and post.published_at is None:
            post.published_at = datetime.now(UTC)
        db.commit()
        return f"{post.locale}/{post.slug}"


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        print("upserted", upsert(Path(arg)))
