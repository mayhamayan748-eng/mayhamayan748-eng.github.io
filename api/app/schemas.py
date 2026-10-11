from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

Locale = Literal["en", "ar"]


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=10, max_length=5000)
    locale: Locale = "en"
    # Honeypot: real visitors never see this field.
    website: str = Field(default="", max_length=200)

    @field_validator("name", "message")
    @classmethod
    def strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("must not be blank")
        return v


class ContactOut(BaseModel):
    ok: bool = True


class PostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    locale: Locale
    title: str
    summary: str
    body_md: str
    tags: list[str]
    cover_url: str | None
    published_at: datetime | None
    translation_group: str | None
