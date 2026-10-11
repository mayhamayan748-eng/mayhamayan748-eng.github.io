"""Generate project cover illustrations (1600x900) in the site's black & gold palette."""

import math
import random
import sys
from pathlib import Path

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1600, 900
BG, SURF, SURF2, LINE = "#0a0a0a", "#141414", "#1c1c1c", "#2a2622"
GOLD, GOLD_B, GOLD_D, AMBER = "#d4af37", "#e8c766", "#b08d2a", "#c9852b"
SILVER, MUTED, TEXT = "#c9c9c9", "#a39e93", "#f5f1e8"
MONO = "JetBrains Mono, Consolas, monospace"


def frame(body: str, glow=(0.3, 0.25)) -> str:
    gx, gy = glow
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
  <radialGradient id="glow" cx="{gx}" cy="{gy}" r="0.75">
    <stop offset="0" stop-color="{GOLD}" stop-opacity="0.16"/>
    <stop offset="1" stop-color="{GOLD}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="goldg" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="{GOLD_D}"/><stop offset=".5" stop-color="{GOLD_B}"/><stop offset="1" stop-color="{GOLD}"/>
  </linearGradient>
  <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="1.5" cy="1.5" r="1.5" fill="{LINE}"/>
  </pattern>
</defs>
<rect width="{W}" height="{H}" fill="{BG}"/>
<rect width="{W}" height="{H}" fill="url(#dots)" opacity="0.7"/>
<rect width="{W}" height="{H}" fill="url(#glow)"/>
{body}
</svg>"""


def text(x, y, s, size=22, fill=MUTED, anchor="start", weight=500):
    return f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{s}</text>'


def chip(x, y, s, color=GOLD, size=20):
    w = len(s) * size * 0.62 + 22
    h = size + 14
    return (f'<rect x="{x}" y="{y}" width="{w:.0f}" height="{h}" rx="4" fill="{BG}" stroke="{color}" stroke-width="1.5"/>'
            + text(x + 11, y + h - 10, s, size, color))


def panel(x, y, w, h, r=16, fill=SURF, stroke=LINE, sw=2):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'


def bars(x, y, widths, gap=26, h=10, color=MUTED, op=0.35, rtl=False, right=None):
    out = []
    for i, w in enumerate(widths):
        xx = (right - w) if rtl else x
        out.append(f'<rect x="{xx}" y="{y + i * gap}" width="{w}" height="{h}" rx="5" fill="{color}" opacity="{op}"/>')
    return "".join(out)


def arrow(x1, y1, x2, y2, color=GOLD, sw=3, dash=None):
    ang = math.atan2(y2 - y1, x2 - x1)
    a1 = (x2 - 16 * math.cos(ang - 0.45), y2 - 16 * math.sin(ang - 0.45))
    a2 = (x2 - 16 * math.cos(ang + 0.45), y2 - 16 * math.sin(ang + 0.45))
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{d}/>'
            f'<polyline points="{a1[0]:.1f},{a1[1]:.1f} {x2},{y2} {a2[0]:.1f},{a2[1]:.1f}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round"/>')


def person(cx, by, h, helmet=True, op=0.55):
    hr = h * 0.075
    top = by - h
    tw = h * 0.2
    s = f'<g fill="{MUTED}" opacity="{op}">'
    s += f'<circle cx="{cx}" cy="{top + hr * 1.4}" r="{hr}"/>'
    if helmet:
        s += f'<path d="M{cx - hr * 1.2},{top + hr * 1.15} a{hr * 1.2},{hr * 0.9} 0 0 1 {hr * 2.4},0 z" fill="{SILVER}"/>'
    s += f'<rect x="{cx - tw / 2}" y="{top + hr * 2.6}" width="{tw}" height="{h * 0.36}" rx="{tw * 0.3}"/>'
    s += f'<rect x="{cx - tw * 0.38}" y="{top + hr * 2.6 + h * 0.33}" width="{tw * 0.3}" height="{h * 0.42}" rx="{tw * 0.15}"/>'
    s += f'<rect x="{cx + tw * 0.08}" y="{top + hr * 2.6 + h * 0.33}" width="{tw * 0.3}" height="{h * 0.42}" rx="{tw * 0.15}"/>'
    return s + "</g>"


def corner_box(x, y, w, h, color=GOLD, dash=None, sw=3):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    k = min(22, w * 0.18)
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{color}" stroke-width="{sw}"{d}/>'
            f'<path d="M{x},{y + k} V{y} H{x + k} M{x + w - k},{y + h} H{x + w} V{y + h - k}" fill="none" stroke="{color}" stroke-width="{sw + 2}"/>')


covers = {}

# 1. Document-AI platform: Arabic form with gold field boxes -> typed JSON
b = panel(170, 110, 520, 690, 14, SURF, LINE)
b += bars(0, 170, [300, 220], 30, 14, SILVER, 0.5, rtl=True, right=640)
fields = [(250, 260, 380, 52), (250, 340, 240, 52), (420, 420, 210, 52), (250, 500, 380, 110), (250, 650, 180, 52)]
for i, (x, y, w, h) in enumerate(fields):
    b += bars(0, y + 18, [w - 60], 26, 12, MUTED, 0.45, rtl=True, right=x + w - 20)
    color = AMBER if i == 3 else GOLD
    b += corner_box(x - 8, y - 6, w + 16, h + 12, color, "8 6" if i == 3 else None, 2)
b += chip(250, 650 + 70, "stamp", AMBER, 16)
b += arrow(720, 450, 860, 450, GOLD, 4)
b += text(790, 425, "VLM", 22, GOLD, "middle", 600)
b += panel(890, 150, 560, 600, 14, SURF, LINE)
json_lines = [
    ('{', TEXT), ('  "doc_type": "form_07",', GOLD_B), ('  "sections": {', TEXT), ('    "header": {', TEXT),
    ('      "date": "2026-07-14",', SILVER), ('      "ref_no": "A-1182"', SILVER), ('    },', TEXT),
    ('    "items": [ … 12 ],', SILVER), ('  },', TEXT), ('  "issues": [', TEXT), ('    "stamp_unclear"', AMBER),
    ('  ],', TEXT), ('  "route": "human_review"', AMBER), ('}', TEXT),
]
for i, (s, c) in enumerate(json_lines):
    b += text(930, 205 + i * 38, s.replace("&", "&amp;"), 22, c)
b += text(1170, 810, "123 fields · 31 types", 22, MUTED, "middle")
covers["document-ai-platform"] = frame(b, (0.25, 0.3))

# 2. PPE compliance: workers + detection boxes, tri-state labels
b = ""
for i in range(9):
    y = 520 + (i / 8) ** 1.6 * 380
    b += f'<line x1="0" y1="{y:.0f}" x2="{W}" y2="{y:.0f}" stroke="{LINE}" stroke-width="2"/>'
for i in range(-9, 10):
    b += f'<line x1="800" y1="520" x2="{800 + i * 190}" y2="{H}" stroke="{LINE}" stroke-width="2"/>'
b += f'<line x1="0" y1="520" x2="{W}" y2="520" stroke="{GOLD}" stroke-opacity=".5" stroke-width="2"/>'
people = [(330, 820, 470, True, "compliant"), (700, 760, 380, False, "violation"), (1040, 640, 220, True, "far"), (1300, 800, 440, True, "compliant")]
for cx, by, h, helmet, st in people:
    b += person(cx, by, h, helmet)
    bw = h * 0.42
    x, y = cx - bw / 2, by - h - h * 0.04
    color = GOLD if st == "compliant" else AMBER
    dash = None if st == "compliant" else "12 8"
    b += corner_box(x, y, bw, h * 1.06, color, dash, 3)
    label = {"compliant": "person 0.94", "violation": "person 0.91", "far": "CHECKING-FAR"}[st]
    b += chip(x, y - 42, label, color, 18)
    if st != "far":
        hr = h * 0.075
        b += f'<rect x="{cx - hr * 1.5}" y="{by - h - hr * 0.2}" width="{hr * 3}" height="{hr * 3.2}" fill="none" stroke="{color}" stroke-width="2"{" stroke-dasharray=&quot;6 5&quot;" if not helmet else ""}/>'
        b += chip(cx + hr * 1.5 + 8, by - h - hr * 0.2, "helmet ✓" if helmet else "no-helmet", color, 16)
b += text(40, 60, "YOLO26s · pose → PPE · tracks 4", 22, MUTED)
b += f'<circle cx="1530" cy="52" r="8" fill="{GOLD}"/>' + text(1510, 60, "LIVE", 22, MUTED, "end")
covers["ppe-compliance"] = frame(b, (0.5, 0.2)).replace("&quot;", '"')

# 3. VLM fine-tuning lab: crop vs full page + precision bars + adapters
b = panel(120, 140, 360, 470, 12)
b += bars(160, 190, [260, 280, 200, 270, 240, 160, 280, 220, 250, 190, 270, 230, 150], 30, 10, MUTED, 0.35)
b += corner_box(150, 330, 300, 120, GOLD, None, 3)
b += chip(150, 285, "crop", GOLD, 18)
b += text(300, 660, "crop  vs  full page", 24, TEXT, "middle", 600)
b += panel(560, 140, 460, 470, 12)
b += text(600, 200, "experiment grid", 22, MUTED)
precisions = ["bf16", "8-bit", "4-bit"]
rows = ["4B crop", "4B page", "9B crop", "9B page"]
for c_, p in enumerate(precisions):
    b += text(735 + c_ * 95, 250, p, 18, GOLD, "middle")
for r_, rl in enumerate(rows):
    y = 275 + r_ * 75
    b += text(600, y + 40, rl, 18, TEXT)
    for c_ in range(3):
        x = 695 + c_ * 95
        done = (r_ + c_) % 3 != 2
        b += f'<rect x="{x}" y="{y}" width="80" height="60" rx="8" fill="{GOLD if done else BG}" fill-opacity="{0.18 if done else 1}" stroke="{GOLD if done else LINE}" stroke-width="2"/>'
        b += text(x + 40, y + 37, "run" if done else "…", 16, GOLD_B if done else MUTED, "middle")
b += text(790, 660, "12 configurations", 20, TEXT, "middle", 600)
# Base model with LoRA adapters
b += panel(1100, 220, 380, 120, 12, SURF2, GOLD_D)
b += text(1290, 292, "Qwen3.5-VL base", 26, TEXT, "middle", 600)
for i in range(4):
    x = 1110 + i * 92
    b += f'<line x1="{x + 40}" y1="340" x2="{x + 40}" y2="420" stroke="{GOLD}" stroke-width="2" stroke-dasharray="6 6"/>'
    b += panel(x, 420, 80, 90, 8, BG, GOLD if i < 2 else LINE)
    b += text(x + 40, 472, f"A{i + 1}", 22, GOLD if i < 2 else MUTED, "middle")
b += text(1290, 570, "vLLM multi-LoRA", 22, MUTED, "middle")
b += text(800, 780, "4B / 9B × bf16 · 8-bit · 4-bit", 26, GOLD_B, "middle", 600)
covers["vlm-finetuning-lab"] = frame(b, (0.5, 0.3))

# 4. Rule extractor: stacked standard pages -> verified yes/no rules
b = ""
for i in range(3):
    b += panel(140 + i * 26, 160 + i * 26, 400, 540, 10, SURF if i < 2 else SURF2, LINE)
b += bars(222, 250, [300, 260, 310, 200, 290, 280, 240, 300, 180, 270, 300, 230, 260], 32, 10, MUTED, 0.35)
b += f'<rect x="216" y="402" width="300" height="24" fill="{GOLD}" opacity=".22"/>'
b += f'<rect x="216" y="402" width="300" height="24" fill="none" stroke="{GOLD}" stroke-width="2"/>'
b += f'<path d="M516 414 C 700 414, 700 300, 860 300" fill="none" stroke="{GOLD}" stroke-width="2.5" stroke-dasharray="8 6"/>'
b += chip(600, 455, "quote matched ✓", GOLD, 18)
rules = [("Is the guardrail at least 1.1 m high?", True), ("Are anchor bolts fully tightened?", True),
         ("Is the drainage slope visible?", False), ("Is the cover plate flush with the floor?", True)]
for i, (q, ok) in enumerate(rules):
    y = 250 + i * 130
    b += panel(860, y, 600, 100, 12, SURF, GOLD if i == 0 else LINE)
    b += text(890, y + 42, f"R-{i + 1:02d}", 18, GOLD)
    b += text(890, y + 76, q, 20, TEXT)
    b += chip(1370, y + 30, "Y/N", GOLD if ok else AMBER, 16)
b += text(1160, 810, "index → extract → dedupe → verify", 22, MUTED, "middle")
covers["vlm-rule-extractor"] = frame(b, (0.6, 0.3))

# 5. Guest-ops copilot: agent graph with deterministic gate and human approval
nodes = {
    "orchestrator": (800, 230), "reservation": (430, 430), "policy": (800, 470),
    "response": (1170, 430), "review/safety": (800, 680),
}
b = ""
edges = [("orchestrator", "reservation"), ("orchestrator", "policy"), ("orchestrator", "response"),
         ("reservation", "review/safety"), ("policy", "review/safety"), ("response", "review/safety")]
for a, c in edges:
    (x1, y1), (x2, y2) = nodes[a], nodes[c]
    b += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{GOLD_D}" stroke-width="2.5" stroke-opacity=".7"/>'
for name, (x, y) in nodes.items():
    main = name == "orchestrator"
    b += f'<circle cx="{x}" cy="{y}" r="{78 if main else 64}" fill="{SURF}" stroke="{GOLD if main else SILVER}" stroke-width="{3 if main else 2}"/>'
    b += text(x, y + 8, name, 20, GOLD if main else TEXT, "middle", 600)
b += text(130, 180, "guest message", 22, MUTED) + arrow(160, 200, 700, 228, GOLD, 3)
# gate
b += f'<polygon points="1040,680 1100,630 1160,680 1100,730" fill="{BG}" stroke="{AMBER}" stroke-width="3"/>'
b += text(1100, 688, "gate", 18, AMBER, "middle", 600)
b += arrow(866, 680, 1036, 680, AMBER, 3)
b += arrow(1164, 680, 1300, 680, AMBER, 3)
b += panel(1310, 630, 200, 100, 12, SURF2, GOLD)
b += text(1410, 672, "human", 20, TEXT, "middle", 600) + text(1410, 702, "approval", 20, TEXT, "middle", 600)
b += text(1100, 790, "only stricter", 18, AMBER, "middle")
b += text(800, 860, "5 ADK agents · durable Temporal workflow", 22, MUTED, "middle")
covers["guest-ops-copilot"] = frame(b, (0.5, 0.35))

# 6. Camera calibration: horizon, gravity, tilted object with angle arc
b = ""
hy = 380
for i in range(10):
    y = hy + (i / 9) ** 1.7 * (H - hy)
    b += f'<line x1="0" y1="{y:.0f}" x2="{W}" y2="{y:.0f}" stroke="{LINE}" stroke-width="2"/>'
for i in range(-10, 11):
    b += f'<line x1="760" y1="{hy}" x2="{760 + i * 170}" y2="{H}" stroke="{LINE}" stroke-width="2"/>'
b += f'<line x1="0" y1="{hy + 40}" x2="{W}" y2="{hy - 40}" stroke="{GOLD}" stroke-width="3" stroke-dasharray="14 10"/>'
b += chip(60, hy + 60, "horizon (est.)", GOLD, 18)
# tilted pole
cx, by, hh, tilt = 820, 780, 400, math.radians(6)
tx, ty = cx + hh * math.sin(tilt), by - hh * math.cos(tilt)
b += f'<line x1="{cx}" y1="{by}" x2="{tx:.0f}" y2="{ty:.0f}" stroke="{SILVER}" stroke-width="18" stroke-linecap="round"/>'
b += f'<line x1="{cx}" y1="{by}" x2="{cx}" y2="{by - hh}" stroke="{GOLD}" stroke-width="2.5" stroke-dasharray="10 8"/>'
b += corner_box(cx - 60, ty - 30, 160, by - ty + 50, GOLD, None, 3)
b += chip(cx - 60, ty - 74, 'OWLv2: "pole" 0.88', GOLD, 18)
r = 170
ax, ay = cx + r * math.sin(tilt), by - r * math.cos(tilt)
b += f'<path d="M{cx},{by - r} A{r},{r} 0 0 1 {ax:.1f},{ay:.1f}" fill="none" stroke="{AMBER}" stroke-width="4"/>'
b += chip(cx + 70, by - r - 40, "6.0° > 2.0° tol", AMBER, 18)
# gravity arrow
b += arrow(1350, 160, 1350, 360, GOLD_B, 4)
b += text(1350, 140, "g", 30, GOLD_B, "middle", 700)
b += panel(1180, 470, 340, 170, 12, SURF, LINE)
for i, (k, v) in enumerate([("f", "1412 px"), ("roll", "-1.8°"), ("pitch", "4.2°")]):
    b += text(1210, 520 + i * 42, k, 20, MUTED) + text(1490, 520 + i * 42, v, 20, TEXT, "end")
b += text(1350, 680, "GeoCalib · single image", 18, MUTED, "middle")
covers["camera-calibration"] = frame(b, (0.55, 0.25))

# 7. SAM 3 auto-labelling: image grid with masks -> YOLO label file
random.seed(3)
b = ""
for r_ in range(2):
    for c_ in range(3):
        x, y = 110 + c_ * 290, 150 + r_ * 300
        b += panel(x, y, 260, 260, 12, SURF2, LINE)
        pts = []
        cx0, cy0, rad = x + 130 + random.randint(-20, 20), y + 140 + random.randint(-15, 15), random.randint(60, 85)
        for k in range(9):
            a = k / 9 * 2 * math.pi
            rr = rad * random.uniform(0.75, 1.15)
            pts.append(f"{cx0 + rr * math.cos(a):.0f},{cy0 + rr * math.sin(a):.0f}")
        b += f'<polygon points="{" ".join(pts)}" fill="{GOLD}" fill-opacity=".22" stroke="{GOLD}" stroke-width="2.5"/>'
        b += f'<rect x="{cx0 - rad * 1.15:.0f}" y="{cy0 - rad * 1.15:.0f}" width="{rad * 2.3:.0f}" height="{rad * 2.3:.0f}" fill="none" stroke="{SILVER}" stroke-width="1.5" stroke-dasharray="6 5"/>'
b += chip(110, 92, 'prompt: "safety helmet"', GOLD, 20)
b += arrow(1000, 450, 1080, 450, GOLD, 4)
b += panel(1100, 170, 400, 560, 12)
b += text(1130, 220, "labels/img_0042.txt", 18, GOLD)
for i in range(10):
    vals = f"0 {random.uniform(.2, .8):.3f} {random.uniform(.2, .8):.3f} {random.uniform(.05, .3):.3f} {random.uniform(.05, .3):.3f}"
    b += text(1130, 270 + i * 42, vals, 18, SILVER if i % 2 else TEXT)
b += text(1300, 780, "YOLO dataset · ready to train", 20, MUTED, "middle")
covers["sam3-autolabel"] = frame(b, (0.3, 0.3))

# 8. Text-to-SQL RAG: question -> schema retrieval -> SQL -> table (on-prem boundary)
b = f'<rect x="70" y="80" width="1460" height="740" rx="24" fill="none" stroke="{GOLD_D}" stroke-width="2" stroke-dasharray="14 10"/>'
b += chip(100, 60, "on-premise", GOLD, 18)
b += panel(130, 170, 420, 130, 18, SURF2, SILVER)
b += bars(0, 205, [330, 250], 34, 14, TEXT, 0.55, rtl=True, right=520)
b += text(160, 280, "AR / EN question", 18, MUTED)
b += arrow(340, 310, 340, 390, GOLD, 3)
b += panel(130, 400, 420, 320, 14)
b += text(160, 445, "Qdrant · schema", 20, GOLD)
for i, t in enumerate(["ORDERS(id, date, total)", "CUSTOMERS(id, city)", "ITEMS(order_id, sku)", "REGIONS(code, name)"]):
    hit = i < 2
    b += panel(160, 470 + i * 58, 360, 44, 8, BG, GOLD if hit else LINE)
    b += text(178, 499 + i * 58, t, 17, TEXT if hit else MUTED)
b += arrow(560, 450, 660, 450, GOLD, 3)
b += panel(670, 170, 420, 400, 14)
b += text(700, 215, "local Qwen → SQL", 20, GOLD)
sql = ["SELECT c.city,", "  SUM(o.total) AS revenue", "FROM orders o", "JOIN customers c", "  ON c.id = o.cust_id", "WHERE o.date >= :q3", "GROUP BY c.city", "ORDER BY revenue DESC;"]
for i, s in enumerate(sql):
    b += text(700, 265 + i * 36, s, 19, GOLD_B if s.split()[0] in {"SELECT", "FROM", "JOIN", "WHERE", "GROUP", "ORDER"} else SILVER)
b += arrow(1100, 370, 1180, 370, GOLD, 3)
b += panel(1190, 230, 300, 300, 12)
b += text(1215, 272, "Oracle 19c", 18, GOLD)
for r_ in range(5):
    y = 295 + r_ * 44
    b += f'<line x1="1210" y1="{y}" x2="1470" y2="{y}" stroke="{LINE}" stroke-width="2"/>'
    b += f'<rect x="1220" y="{y + 14}" width="{100 - r_ * 8}" height="10" rx="5" fill="{MUTED}" opacity=".45"/>'
    b += f'<rect x="{1460 - (150 - r_ * 22)}" y="{y + 12}" width="{150 - r_ * 22}" height="14" rx="4" fill="{GOLD}" opacity="{0.9 - r_ * 0.13:.2f}"/>'
b += text(800, 770, "no data leaves the server", 22, MUTED, "middle")
covers["text-to-sql-rag"] = frame(b, (0.45, 0.3))

# 9. IDP forecasting: abstract region map with flow arcs + SHAP bars
random.seed(9)
b = panel(110, 130, 820, 640, 16)
regions = [(260, 260), (420, 210), (600, 290), (760, 230), (330, 450), (520, 470), (720, 430), (280, 640), (480, 650), (700, 620), (820, 520)]
for (x, y) in regions:
    rr = random.randint(26, 46)
    b += f'<circle cx="{x}" cy="{y}" r="{rr}" fill="{SILVER}" fill-opacity=".08" stroke="{SILVER}" stroke-opacity=".35" stroke-width="2"/>'
flows = [(0, 5, 5), (1, 5, 3), (3, 6, 4), (7, 8, 2), (9, 6, 3), (2, 6, 2), (10, 6, 2)]
for a, c, wgt in flows:
    (x1, y1), (x2, y2) = regions[a], regions[c]
    mx, my = (x1 + x2) / 2, min(y1, y2) - 80
    b += f'<path d="M{x1},{y1} Q{mx},{my} {x2},{y2}" fill="none" stroke="{GOLD}" stroke-width="{wgt * 1.6}" stroke-opacity=".75" stroke-linecap="round"/>'
    b += f'<circle cx="{x2}" cy="{y2}" r="7" fill="{GOLD_B}"/>'
b += text(520, 815, "forecast displacement flows (synthetic)", 20, MUTED, "middle")
b += panel(1000, 130, 500, 640, 16)
b += text(1030, 180, "SHAP · feature impact (illustrative)", 18, GOLD)
feats = [("conflict events (t-1)", 0.92), ("prior inflow", 0.71), ("food prices", 0.55), ("access constraints", 0.44), ("season", 0.28), ("distance", -0.32)]
for i, (f, v) in enumerate(feats):
    y = 230 + i * 86
    b += text(1030, y + 18, f, 18, TEXT)
    w = abs(v) * 300
    col = GOLD if v > 0 else AMBER
    b += f'<rect x="{1150 if v > 0 else 1150 - w:.0f}" y="{y + 32}" width="{w:.0f}" height="20" rx="4" fill="{col}" opacity=".85"/>'
b += f'<line x1="1150" y1="250" x2="1150" y2="760" stroke="{MUTED}" stroke-width="1.5" stroke-opacity=".5"/>'
b += chip(1260, 700, "100/100", GOLD, 22)
covers["idp-forecasting"] = frame(b, (0.35, 0.4))

# 10. Claude Code skills: terminal window + 8 skill chips
b = panel(220, 110, 1160, 680, 18, SURF, LINE)
b += f'<rect x="220" y="110" width="1160" height="56" rx="18" fill="{SURF2}"/><rect x="220" y="146" width="1160" height="20" fill="{SURF2}"/>'
for i, c in enumerate([AMBER, GOLD, SILVER]):
    b += f'<circle cx="{256 + i * 30}" cy="138" r="8" fill="{c}" opacity=".8"/>'
b += text(800, 146, "~/.claude/skills", 20, MUTED, "middle")
lines = [("$ claude", TEXT), ("> /computer-vision-engineer detect helmets in site.mp4", GOLD_B),
         ("  ✓ model: YOLO26s (alternatives compared)", SILVER), ("  ✓ ran on sample frame · 14 detections", SILVER)]
for i, (s, c) in enumerate(lines):
    b += text(270, 220 + i * 40, s, 20, c)
skills = ["computer-vision", "ml-system-design", "llm-rag", "fastapi-backend", "python-review", "paper-explainer", "prompt-engineering", "git-assistant"]
for i, s in enumerate(skills):
    col, row = i % 4, i // 4
    x, y = 270 + col * 270, 440 + row * 120
    b += panel(x, y, 250, 90, 12, BG, GOLD if i == 0 else LINE)
    b += text(x + 20, y + 38, f"{i + 1:02d}", 16, GOLD)
    b += text(x + 20, y + 68, s, 18, TEXT)
b += text(800, 730, "structured outputs · sensible defaults · build first, explain after", 19, MUTED, "middle")
covers["claude-code-skills"] = frame(b, (0.5, 0.2))

# 11. GAN faces: noise -> generator -> grid of abstract faces
random.seed(11)
b = panel(110, 250, 260, 400, 14)
for r_ in range(8):
    for c_ in range(5):
        v = random.random()
        b += f'<rect x="{140 + c_ * 42}" y="{280 + r_ * 44}" width="34" height="36" rx="4" fill="{SILVER}" opacity="{0.1 + v * 0.5:.2f}"/>'
b += text(240, 700, "z ~ N(0, I)", 20, MUTED, "middle")
b += arrow(390, 450, 480, 450, GOLD, 4)
b += f'<polygon points="500,330 640,390 640,510 500,570" fill="{SURF2}" stroke="{GOLD}" stroke-width="3"/>'
b += text(570, 458, "G", 34, GOLD, "middle", 700)
b += arrow(660, 450, 740, 450, GOLD, 4)
for r_ in range(3):
    for c_ in range(4):
        x, y = 770 + c_ * 190, 150 + r_ * 210
        b += panel(x, y, 170, 190, 12, SURF2, GOLD if (r_, c_) == (1, 2) else LINE)
        fx, fy = x + 85, y + 92
        rw, rh = random.randint(44, 54), random.randint(56, 66)
        b += f'<ellipse cx="{fx}" cy="{fy}" rx="{rw}" ry="{rh}" fill="{SILVER}" fill-opacity=".14" stroke="{SILVER}" stroke-opacity=".5" stroke-width="2"/>'
        ey = fy - 12
        b += f'<circle cx="{fx - 18}" cy="{ey}" r="5" fill="{TEXT}" opacity=".7"/><circle cx="{fx + 18}" cy="{ey}" r="5" fill="{TEXT}" opacity=".7"/>'
        b += f'<path d="M{fx - 16},{fy + 26} Q{fx},{fy + 26 + random.randint(-6, 10)} {fx + 16},{fy + 26}" fill="none" stroke="{TEXT}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>'
        b += f'<path d="M{fx - rw},{fy - 10} Q{fx},{fy - rh - random.randint(10, 30)} {fx + rw},{fy - 10}" fill="none" stroke="{GOLD}" stroke-opacity=".45" stroke-width="3"/>'
b += text(1150, 820, "UTKFace · label smoothing vs mode collapse", 20, MUTED, "middle")
covers["gan-faces"] = frame(b, (0.6, 0.3))

for slug, svg in covers.items():
    (OUT / f"{slug}.svg").write_text(svg, encoding="utf-8")
print(len(covers), "covers written to", OUT)
