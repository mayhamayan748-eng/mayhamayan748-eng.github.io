from sqlalchemy import select

from app.config import get_settings
from app.models import ContactMessage

VALID = {
    "name": "Test Person",
    "email": "test@example.com",
    "message": "Hello, I would like to talk about a CV project.",
    "locale": "ar",
}


def stored(session_factory) -> list[ContactMessage]:
    with session_factory() as db:
        return list(db.scalars(select(ContactMessage)))


def test_contact_stores_message_and_notifies(client, session_factory, sent):
    r = client.post("/api/contact", json=VALID, headers={"User-Agent": "pytest"})
    assert r.status_code == 201
    assert r.json() == {"ok": True}

    rows = stored(session_factory)
    assert len(rows) == 1
    msg = rows[0]
    assert msg.email == VALID["email"] and msg.locale == "ar" and msg.user_agent == "pytest"
    assert msg.ip_hash and len(msg.ip_hash) == 64  # hashed, never the raw IP
    assert sent == [{"name": "Test Person", "email": "test@example.com", "message": VALID["message"], "locale": "ar"}]


def test_honeypot_pretends_success_but_stores_nothing(client, session_factory, sent):
    r = client.post("/api/contact", json={**VALID, "website": "http://spam.example"})
    assert r.status_code == 201
    assert stored(session_factory) == []
    assert sent == []


def test_validation_errors(client, session_factory):
    assert client.post("/api/contact", json={**VALID, "email": "nope"}).status_code == 422
    assert client.post("/api/contact", json={**VALID, "message": "short"}).status_code == 422
    assert client.post("/api/contact", json={**VALID, "name": "   "}).status_code == 422
    assert client.post("/api/contact", json={**VALID, "locale": "fr"}).status_code == 422
    assert stored(session_factory) == []


def test_rate_limit(client, session_factory):
    get_settings().contact_rate_limit = "2/minute"
    codes = [client.post("/api/contact", json=VALID).status_code for _ in range(3)]
    assert codes == [201, 201, 429]
    assert len(stored(session_factory)) == 2


def test_cors_allows_site_origin_only(client):
    ok = client.options(
        "/api/contact", headers={"Origin": "http://localhost:4321", "Access-Control-Request-Method": "POST"}
    )
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:4321"
    bad = client.options(
        "/api/contact", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"}
    )
    assert "access-control-allow-origin" not in bad.headers
