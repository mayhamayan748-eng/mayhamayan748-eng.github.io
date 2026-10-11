import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:4321")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401
from app.config import get_settings
from app.db import Base, get_db
from app.main import app
from app.ratelimit import limiter
from app.routers import contact as contact_router


@pytest.fixture
def session_factory():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    yield sessionmaker(bind=engine, expire_on_commit=False)
    engine.dispose()


@pytest.fixture
def sent(monkeypatch):
    """Captures notification calls instead of sending email."""
    calls: list[dict] = []
    monkeypatch.setattr(contact_router, "notify_contact", lambda settings, **kw: calls.append(kw))
    return calls


@pytest.fixture
def client(session_factory, sent):
    def override():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override
    limiter.reset()
    get_settings().contact_rate_limit = "5/hour"
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
