# Ayham Ayan — Portfolio

Bilingual (EN / AR with full RTL) portfolio. Black & gold, dark-first.

```
web/   Astro 5 static site → GitHub Pages
api/   FastAPI + SQLAlchemy + Alembic → Render (Docker) + Postgres
```

## Local development

**API** (port 8765, since 8000 is taken locally):

```bash
cd api
python -m venv .venv && .venv/Scripts/pip install -r requirements-dev.txt   # Windows
cp .env.example .env
.venv/Scripts/alembic upgrade head
.venv/Scripts/uvicorn app.main:app --port 8765 --reload
.venv/Scripts/python -m pytest -q
```

**Web** (port 4321):

```bash
cd web
npm install
cp .env.example .env        # PUBLIC_API_URL=http://localhost:8765
npm run dev                 # or: npm run build && npm run preview
```

## Editing content

| What | Where |
|---|---|
| Name, bio, links, experience, education, skills, "Beyond code", publications | `web/src/data/site.ts` |
| Projects (one JSON per project, EN + AR fields) | `web/src/content/projects/*.json` |
| UI strings | `web/src/i18n/ui.ts` |
| CV PDF | `web/public/cv/Mohamad_Ayham_Ayan_CV_AI.pdf` |
| Colors (black & gold tokens, light theme) | `web/src/styles/global.css` |

Rules built into the site:
- A link set to `null` in `site.ts` is hidden everywhere.
- A metric with `"value": null` renders as "—". Fill in the number when it's cleared for publication.
- A project with an empty `media` list gets a generated placeholder. Media for `nda: "full"` projects must be synthetic or blurred.
- Publications and certifications are hidden while their lists are empty.
- The blog appears (nav link + `/blog` pages) only when the API returns published posts for that locale.

### Blog posts

Posts live in the API DB. Write Markdown with a front-matter header (format is documented in `api/scripts/seed_posts.py`), then:

```bash
cd api && .venv/Scripts/python -m scripts.seed_posts path/to/post.md
```

Pages pick posts up at build time. The Pages workflow rebuilds daily, or you can trigger it manually.

## Deploy

1. **Push** this repo to GitHub as `mayhamayan748-eng.github.io`.
2. **API**: on Render, go to New → Blueprint and select this repo. `render.yaml` creates the service and the free Postgres DB. Set `RESEND_API_KEY` and `NOTIFY_EMAIL` in the dashboard, and `ALLOWED_ORIGINS=https://mayhamayan748-eng.github.io`.
3. **Pages**: under Settings → Pages, set the source to GitHub Actions. Under Settings → Secrets and variables → Actions → Variables, add:
   - `PUBLIC_API_URL` = your Render URL, e.g. `https://ayham-portfolio-api.onrender.com`
   - `SITE_URL` = `https://mayhamayan748-eng.github.io`
4. Custom domain later: add `web/public/CNAME` containing the domain, then update `SITE_URL` and `ALLOWED_ORIGINS`.

Note: the Render free tier sleeps when idle, so the first contact submission after a while can take ~30s. The message is still saved.

## Content TODO

- [ ] Accuracy metrics cleared for publication (PPE mAP@50 / per-class precision / FPS, VLM lab accuracy per run / VRAM / tokens/s, rule-extractor precision). Add them to the matching `web/src/content/projects/*.json`
- [ ] Project media (synthetic or blurred for NDA projects)
- [ ] Public repo links: SAM 3 tool, Claude Code skills; calibration demo URL if any
- [ ] Optional: move images to Cloudinary (`profile.photo`, project `media`)
