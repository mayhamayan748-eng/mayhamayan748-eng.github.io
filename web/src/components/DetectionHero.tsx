import { useEffect, useRef } from 'react';

/**
 * Synthetic "live detection" scene: silhouettes walk across a perspective floor
 * while gold boxes track them. No real footage is used.
 *
 * States mirror the PPE system's compliance logic:
 *  - compliant   -> solid gold box, "helmet ✓"
 *  - violation   -> dashed amber box, "no-helmet"
 *  - far         -> dashed amber box, "CHECKING-FAR" (system abstains)
 */

type Figure = {
  id: number;
  x: number; // 0..1 across the floor
  z: number; // depth: 0.2 (far) .. 1 (near)
  dir: 1 | -1;
  speed: number;
  helmet: boolean;
  phase: number; // walk-cycle phase
  conf: number;
  jitter: [number, number, number, number];
  reidFlash: number; // frames left to show "re-ID ✓"
};

type Colors = { gold: string; amber: string; bg: string; surface: string; text: string; muted: string; line: string };

const FAR_Z = 0.42;
let nextId = 1;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function spawn(initial = false): Figure {
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  const z = rand(0.22, 1);
  return {
    id: nextId++,
    x: initial ? rand(0.05, 0.95) : dir === 1 ? -0.08 : 1.08,
    z,
    dir,
    speed: rand(0.0007, 0.0013) * (0.5 + z),
    helmet: Math.random() < 0.72,
    phase: rand(0, Math.PI * 2),
    conf: rand(0.86, 0.97),
    jitter: [0, 0, 0, 0],
    reidFlash: 0,
  };
}

/** Blend two hex colors; t=0 gives a, t=1 gives b. Silhouettes are drawn opaque so overlapping limbs don't double up. */
function mix(a: string, b: string, t: number) {
  const p = (h: string) => {
    const x = h.replace('#', '');
    const f = x.length === 3 ? x.split('').map((c) => c + c).join('') : x.slice(0, 6);
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
  };
  const [A, B] = [p(a), p(b)];
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
}

function readColors(): Colors {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
  return {
    gold: v('--gold', '#d4af37'),
    amber: v('--amber', '#c9852b'),
    bg: v('--bg', '#0a0a0a'),
    surface: v('--surface', '#141414'),
    text: v('--text', '#f5f1e8'),
    muted: v('--muted', '#a39e93'),
    line: v('--border', '#2a2622'),
  };
}

export default function DetectionHero({ label, count = 5 }: { label: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Labels are technical (English) even on the Arabic page.
    ctx.direction = 'ltr';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let colors = readColors();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let frame = 0;
    let lastFps = 30;
    let lastT = performance.now();

    nextId = 1;
    // Spread initial positions evenly so labels don't pile up on first paint.
    const figures: Figure[] = Array.from({ length: count }, (_, i) => {
      const f = spawn(true);
      f.x = (i + 0.5) / count + rand(-0.04, 0.04);
      return f;
    });
    // Guarantee one far figure so the CHECKING-FAR state is always on screen.
    figures[0].z = 0.3;
    figures[1].helmet = false;
    figures[1].z = 0.75;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.direction = 'ltr'; // resizing resets context state
      if (reduced) draw();
    };

    const horizon = () => h * 0.38;
    const groundY = (z: number) => horizon() + (h - horizon()) * (0.12 + 0.82 * z);

    function drawFloor() {
      const hy = horizon();
      ctx!.strokeStyle = colors.line;
      ctx!.lineWidth = 1;
      // Receding lines toward a vanishing point
      const vx = w / 2;
      for (let i = -10; i <= 10; i++) {
        ctx!.beginPath();
        ctx!.moveTo(vx, hy);
        ctx!.lineTo(vx + i * w * 0.12, h);
        ctx!.stroke();
      }
      // Horizontal lines, spaced by depth
      for (let i = 1; i <= 9; i++) {
        const z = (i / 9) ** 1.6;
        const y = hy + (h - hy) * z;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }
      // Gold horizon hairline
      const g = ctx!.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.5, colors.gold);
      g.addColorStop(1, 'transparent');
      ctx!.strokeStyle = g;
      ctx!.globalAlpha = 0.5;
      ctx!.beginPath();
      ctx!.moveTo(0, hy);
      ctx!.lineTo(w, hy);
      ctx!.stroke();
      ctx!.globalAlpha = 1;
    }

    function figureGeom(f: Figure) {
      const scale = Math.min(w, h * 1.6) * 0.0019 * (0.35 + f.z);
      const H = 170 * scale; // person height in px
      const cx = f.x * w;
      const by = groundY(f.z);
      return { scale, H, cx, by };
    }

    function drawFigure(f: Figure) {
      const { H, cx, by } = figureGeom(f);
      const d = f.dir; // facing direction (side view)
      const p = f.phase;
      // Opaque tones: near figures stand out, far ones sink into the floor.
      const strength = 0.3 + 0.45 * f.z;
      const body = mix(colors.surface, colors.muted, strength);
      const back = mix(colors.surface, colors.muted, strength * 0.62); // limbs on the far side
      const bob = Math.abs(Math.cos(p)) * H * 0.012;
      const ground = by - H * 0.01;
      const hipY = by - H * 0.5 - bob;
      const shoulderY = by - H * 0.81 - bob;
      const lean = H * 0.025 * d;
      const hipX = cx;
      const shX = cx + lean;
      const headR = H * 0.068;
      const headX = shX + d * H * 0.012;
      const headY = shoulderY - H * 0.035 - headR;

      const limb = (pts: [number, number][], width: number, color: string) => {
        ctx!.strokeStyle = color;
        ctx!.lineWidth = width;
        ctx!.lineCap = 'round';
        ctx!.lineJoin = 'round';
        ctx!.beginPath();
        ctx!.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i][0], pts[i][1]);
        ctx!.stroke();
      };
      // Angles are measured from straight down; positive swings toward the facing direction.
      const at = (x: number, y: number, len: number, ang: number): [number, number] => [x + Math.sin(ang) * len * d, y + Math.cos(ang) * len];

      const leg = (ph: number, color: string) => {
        const thigh = Math.sin(ph) * 0.42;
        const bend = 0.08 + 0.55 * Math.max(0, Math.cos(ph)) * Math.max(0, Math.sin(ph + 1.2)); // knee folds on the swing-through
        const knee = at(hipX, hipY, H * 0.25, thigh);
        const ankle = at(knee[0], knee[1], H * 0.23, thigh - bend);
        const ay = Math.min(ankle[1], ground - H * 0.015);
        const toe: [number, number] = [ankle[0] + d * H * 0.065, Math.min(ay + H * 0.012, ground)];
        limb([[hipX, hipY], knee, [ankle[0], ay]], H * 0.075, color);
        limb([[ankle[0] - d * H * 0.012, ay], toe], H * 0.045, color); // shoe
      };
      const arm = (ph: number, color: string) => {
        const upper = -Math.sin(ph) * 0.38; // arms counter-swing the legs
        const elbowBend = 0.25 + 0.3 * Math.max(0, -Math.sin(ph));
        const elbow = at(shX, shoulderY + H * 0.015, H * 0.16, upper);
        const wrist = at(elbow[0], elbow[1], H * 0.145, upper + elbowBend);
        limb([[shX, shoulderY + H * 0.015], elbow, wrist], H * 0.05, color);
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(wrist[0] + d * H * 0.008, wrist[1] + H * 0.012, H * 0.026, 0, Math.PI * 2); // hand
        ctx!.fill();
      };

      // Far-side limbs first, then torso and head, then near-side limbs.
      arm(p + Math.PI, back);
      leg(p + Math.PI, back);
      // Torso: shoulders taper to the waist.
      const sw = H * 0.085;
      const ww = H * 0.065;
      ctx!.fillStyle = body;
      ctx!.beginPath();
      ctx!.moveTo(shX - sw, shoulderY + H * 0.01);
      ctx!.quadraticCurveTo(shX - sw, shoulderY - H * 0.02, shX, shoulderY - H * 0.02);
      ctx!.quadraticCurveTo(shX + sw, shoulderY - H * 0.02, shX + sw, shoulderY + H * 0.01);
      ctx!.lineTo(hipX + ww, hipY + H * 0.02);
      ctx!.quadraticCurveTo(hipX, hipY + H * 0.05, hipX - ww, hipY + H * 0.02);
      ctx!.closePath();
      ctx!.fill();
      // Neck and head (slightly forward, like a real walk).
      limb([[shX, shoulderY], [headX - d * H * 0.005, headY + headR * 0.8]], H * 0.04, body);
      ctx!.beginPath();
      ctx!.ellipse(headX, headY, headR * 0.92, headR, 0, 0, Math.PI * 2);
      ctx!.fill();
      // Nose hint so the facing direction reads.
      ctx!.beginPath();
      ctx!.moveTo(headX + d * headR * 0.85, headY - headR * 0.1);
      ctx!.lineTo(headX + d * headR * 1.15, headY + headR * 0.25);
      ctx!.lineTo(headX + d * headR * 0.8, headY + headR * 0.35);
      ctx!.fill();
      if (f.helmet) {
        // Hard hat: dome plus a brim that sticks out front.
        ctx!.fillStyle = mix(colors.surface, colors.text, strength * 0.9);
        ctx!.beginPath();
        ctx!.ellipse(headX, headY - headR * 0.15, headR * 1.08, headR * 0.95, 0, Math.PI, 0);
        ctx!.fill();
        ctx!.fillRect(Math.min(headX - d * headR * 1.05, headX + d * headR * 1.45), headY - headR * 0.2, headR * 2.5, headR * 0.22);
      }
      arm(p, body);
      leg(p, body);
    }

    function chip(x: number, y: number, text: string, color: string, alignBottom = true) {
      ctx!.font = `500 ${w < 640 ? 10 : 11}px "JetBrains Mono", ui-monospace, monospace`;
      const pad = 5;
      const tw = ctx!.measureText(text).width + pad * 2;
      const th = w < 640 ? 16 : 18;
      const cy = alignBottom ? y - th : y;
      const cx = Math.max(2, Math.min(x, w - tw - 2));
      ctx!.fillStyle = colors.bg;
      ctx!.globalAlpha = 0.88;
      ctx!.fillRect(cx, cy, tw, th);
      ctx!.globalAlpha = 1;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;
      ctx!.strokeRect(cx + 0.5, cy + 0.5, tw - 1, th - 1);
      ctx!.fillStyle = color;
      ctx!.textBaseline = 'middle';
      ctx!.fillText(text, cx + pad, cy + th / 2 + 0.5);
    }

    function drawBoxes(f: Figure) {
      const { H, cx, by } = figureGeom(f);
      const far = f.z < FAR_Z;
      const violation = !far && !f.helmet;
      const color = far || violation ? colors.amber : colors.gold;
      const [j0, j1, j2, j3] = f.jitter;
      const bw = H * 0.42;
      const x = cx - bw / 2 + j0;
      const y = by - H - H * 0.04 + j1;
      const bw2 = bw + j2;
      const bh = H * 1.06 + j3;

      ctx!.strokeStyle = color;
      ctx!.lineWidth = f.z > 0.6 ? 1.75 : 1.25;
      ctx!.setLineDash(far || violation ? [6, 4] : []);
      ctx!.strokeRect(x, y, bw2, bh);
      // corner ticks
      ctx!.setLineDash([]);
      const k = Math.min(10, bw2 * 0.18);
      ctx!.lineWidth = 2.25;
      ctx!.beginPath();
      ctx!.moveTo(x, y + k); ctx!.lineTo(x, y); ctx!.lineTo(x + k, y);
      ctx!.moveTo(x + bw2 - k, y + bh); ctx!.lineTo(x + bw2, y + bh); ctx!.lineTo(x + bw2, y + bh - k);
      ctx!.stroke();

      const id = String(f.id).padStart(2, '0');
      const label = far ? `CHECKING-FAR · #${id}` : `person ${f.conf.toFixed(2)} · #${id}`;
      chip(x, y - 2, label, color);

      // Head sub-box for near figures
      if (!far && H > 60) {
        const hr = H * 0.075;
        const hx = cx - hr * 1.5;
        const hy = by - H - hr * 0.2;
        ctx!.setLineDash(violation ? [3, 3] : []);
        ctx!.lineWidth = 1;
        ctx!.strokeRect(hx, hy, hr * 3, hr * 3.2);
        ctx!.setLineDash([]);
        chip(hx + hr * 3 + 4, hy, violation ? 'no-helmet' : 'helmet ✓', color, false);
      }
      if (f.reidFlash > 0 && !far) {
        ctx!.globalAlpha = Math.min(1, f.reidFlash / 20);
        chip(x, y + bh + 4, 're-ID ✓', colors.gold, false);
        ctx!.globalAlpha = 1;
      }
    }

    function drawHud(tracks: number) {
      const fs = w < 640 ? 10 : 11;
      ctx!.font = `500 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
      ctx!.fillStyle = colors.muted;
      ctx!.textBaseline = 'top';
      const lines = ['YOLO26s · conf>0.50', `tracks ${tracks} · ${Math.round(lastFps)} fps`];
      lines.forEach((l, i) => ctx!.fillText(l, 14, 14 + i * (fs + 6)));
      // recording dot
      ctx!.fillStyle = colors.gold;
      ctx!.globalAlpha = reduced ? 1 : 0.55 + 0.45 * Math.sin(frame / 12);
      ctx!.beginPath();
      ctx!.arc(w - 18, 20, 4, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 1;
      ctx!.textAlign = 'right';
      ctx!.fillStyle = colors.muted;
      ctx!.fillText('LIVE · synthetic', w - 28, 14);
      ctx!.textAlign = 'left';
    }

    function step() {
      for (let i = 0; i < figures.length; i++) {
        const f = figures[i];
        f.x += f.dir * f.speed;
        f.phase += 0.09 + f.speed * 40;
        // Smoothed jitter: detections wobble a little, like a real detector.
        f.jitter = f.jitter.map((j) => j * 0.85 + rand(-1, 1) * 0.6) as Figure['jitter'];
        f.conf = Math.min(0.99, Math.max(0.78, f.conf + rand(-0.006, 0.006)));
        if (f.reidFlash > 0) f.reidFlash--;
        // Occasionally simulate a re-identification event.
        if (Math.random() < 0.0015 && f.z >= FAR_Z) f.reidFlash = 60;
        if (f.x < -0.12 || f.x > 1.12) figures[i] = spawn();
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      drawFloor();
      const sorted = [...figures].sort((a, b) => a.z - b.z);
      sorted.forEach(drawFigure);
      sorted.forEach(drawBoxes);
      drawHud(figures.length);
    }

    function loop(t: number) {
      const dt = t - lastT;
      lastT = t;
      if (dt > 0) lastFps = lastFps * 0.95 + (1000 / dt) * 0.05;
      frame++;
      step();
      draw();
      raf = requestAnimationFrame(loop);
    }

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      lastT = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    // Re-read colors when the theme changes.
    const mo = new MutationObserver(() => {
      colors = readColors();
      if (reduced) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (reduced) draw();
    else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [count]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="block h-full w-full" />;
}
