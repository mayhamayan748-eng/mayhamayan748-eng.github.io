from datetime import UTC, datetime

from app.models import Post


def seed(session_factory):
    with session_factory() as db:
        db.add_all(
            [
                Post(
                    slug="yolo-fp",
                    locale="en",
                    title="FP budgets",
                    published=True,
                    published_at=datetime(2026, 9, 1, tzinfo=UTC),
                    translation_group="g1",
                ),
                Post(
                    slug="yolo-fp",
                    locale="ar",
                    title="ميزانية الإنذارات",
                    published=True,
                    published_at=datetime(2026, 9, 1, tzinfo=UTC),
                    translation_group="g1",
                ),
                Post(
                    slug="newer",
                    locale="en",
                    title="Newer",
                    published=True,
                    published_at=datetime(2026, 10, 1, tzinfo=UTC),
                ),
                Post(slug="draft", locale="en", title="Draft", published=False),
            ]
        )
        db.commit()


def test_list_only_published_newest_first(client, session_factory):
    seed(session_factory)
    r = client.get("/api/posts", params={"locale": "en"})
    assert r.status_code == 200
    assert [p["slug"] for p in r.json()] == ["newer", "yolo-fp"]


def test_list_filters_by_locale(client, session_factory):
    seed(session_factory)
    ar = client.get("/api/posts", params={"locale": "ar"}).json()
    assert [(p["slug"], p["title"]) for p in ar] == [("yolo-fp", "ميزانية الإنذارات")]
    assert len(client.get("/api/posts").json()) == 3


def test_get_post(client, session_factory):
    seed(session_factory)
    assert client.get("/api/posts/yolo-fp", params={"locale": "ar"}).json()["translation_group"] == "g1"
    assert client.get("/api/posts/draft").status_code == 404
    assert client.get("/api/posts/missing").status_code == 404


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}
