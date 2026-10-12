'use client';

import { useEffect, useRef, type RefObject } from 'react';

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  /** 1 = circular halo around the hole, < 1 = flattened accretion disk. */
  tilt: number;
  color: string;
  life: number;
  /** Displacement from the orbit, pushed around by the cursor. */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  px: number;
  py: number;
};

type Star = { x: number; y: number; z: number; size: number; phase: number };

const DISK_COLORS = ['255,246,235', '255,214,160', '255,170,90', '255,128,56', '255,92,48'];
const HALO_COLORS = ['255,236,214', '255,190,120', '196,168,255'];

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Full-screen canvas that draws an accretion disk orbiting `targetRef`
 * (the "0" of the 404). Purely decorative: the page reads fine without it.
 */
export function SingularityCanvas({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let horizon = 60;
    let outer = 400;
    let particles: Particle[] = [];
    let stars: Star[] = [];
    const pointer = { x: -9999, y: -9999, nx: 0, ny: 0, tnx: 0, tny: 0 };
    let raf = 0;
    let last = performance.now();

    const measure = () => {
      const rect = targetRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) {
        cx = width / 2;
        cy = height / 2;
        return;
      }
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      horizon = rect.width / 2;
    };

    const spawn = (p: Partial<Particle> = {}, fresh = false): Particle => {
      const halo = Math.random() < 0.22;
      const radius = halo
        ? horizon * (1.08 + Math.random() * 1.1)
        : horizon * 1.05 + Math.pow(Math.random(), 1.5) * (outer - horizon);

      return {
        angle: Math.random() * Math.PI * 2,
        radius: fresh ? radius : halo ? radius : outer * (0.85 + Math.random() * 0.15),
        speed: 0.7 + Math.random() * 0.6,
        size: halo ? 0.6 + Math.random() * 0.9 : 0.6 + Math.random() * 1.6,
        tilt: halo ? 0.92 + Math.random() * 0.08 : 0.2 + Math.random() * 0.14,
        color: halo ? pick(HALO_COLORS) : pick(DISK_COLORS),
        life: fresh ? 1 : 0,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        px: Number.NaN,
        py: Number.NaN,
        ...p,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      measure();
      outer = Math.max(horizon * 3, Math.min(width * 0.55, height * 1.1));

      const count = Math.round(Math.min(650, Math.max(200, (width * height) / 2200)));
      particles = Array.from({ length: count }, () => spawn({}, true));
      stars = Array.from({ length: Math.round((width * height) / 14000) }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.2 + Math.random() * 0.8,
        size: Math.random() * 1.1 + 0.2,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (now: number, dt: number) => {
      measure();

      pointer.nx += (pointer.tnx - pointer.nx) * Math.min(1, dt * 3);
      pointer.ny += (pointer.tny - pointer.ny) * Math.min(1, dt * 3);

      // Fade the previous frame instead of clearing it, which leaves motion trails.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${reduceMotion ? 1 : 0.26})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (const s of stars) {
        const twinkle = 0.75 + 0.25 * Math.sin(now * 0.0006 * s.z + s.phase);
        const x = s.x * width - pointer.nx * 24 * s.z;
        const y = s.y * height - pointer.ny * 24 * s.z;
        ctx.fillStyle = `rgba(255,240,225,${0.12 * twinkle * s.z})`;
        ctx.fillRect(x, y, s.size, s.size);
      }

      // The disk re-orients a little toward the cursor.
      const phi = -0.18 + pointer.nx * 0.12;
      const tiltBias = pointer.ny * 0.08;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Keplerian-ish: inner orbits are faster, and everything slowly spirals in.
        const rel = horizon / p.radius;
        p.angle += p.speed * 1.8 * Math.pow(rel, 1.5) * dt;
        p.radius -= p.speed * horizon * 0.028 * (0.4 + rel * rel * 3) * dt;
        p.life = Math.min(1, p.life + dt * 0.8);

        if (p.radius < horizon * 0.94) {
          p = particles[i] = spawn();
        }

        const tilt = p.tilt < 0.9 ? p.tilt + tiltBias : p.tilt;
        const lx = Math.cos(p.angle) * p.radius;
        const ly = Math.sin(p.angle) * p.radius * tilt;
        const bx = cx + lx * cosPhi - ly * sinPhi;
        const by = cy + lx * sinPhi + ly * cosPhi;

        // Cursor repulsion + spring back onto the orbit.
        const mdx = bx + p.ox - pointer.x;
        const mdy = by + p.oy - pointer.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 150 && md > 0.01) {
          const push = (1 - md / 150) * 1400 * dt;
          p.vx += (mdx / md) * push;
          p.vy += (mdy / md) * push;
        }
        p.vx = (p.vx - p.ox * 7 * dt) * Math.pow(0.04, dt);
        p.vy = (p.vy - p.oy * 7 * dt) * Math.pow(0.04, dt);
        p.ox += p.vx * dt;
        p.oy += p.vy * dt;

        const x = bx + p.ox;
        const y = by + p.oy;

        // Relativistic beaming: the side moving toward us glows brighter.
        const beaming = p.tilt < 0.9 ? 0.55 + 0.45 * Math.cos(p.angle + Math.PI / 2) : 0.8;
        const t = (p.radius - horizon) / (outer - horizon);
        const alpha = Math.max(0, (1 - t) ** 1.4) * beaming * p.life * 0.85;

        if (alpha > 0.01) {
          ctx.strokeStyle = `rgba(${p.color},${Math.min(1, alpha)})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          if (Number.isNaN(p.px) || Math.hypot(x - p.px, y - p.py) > 60) {
            ctx.moveTo(x - 0.5, y);
          } else {
            ctx.moveTo(p.px, p.py);
          }
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        p.px = x;
        p.py = y;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.tnx = (e.clientX / width) * 2 - 1;
      pointer.tny = (e.clientY / height) * 2 - 1;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.tnx = 0;
      pointer.tny = 0;
    };

    resize();

    if (reduceMotion) {
      // One still frame: settle the particles so the disk is visible, then stop.
      for (let i = 0; i < 3; i++) draw(0, 0.016);
      const onResize = () => {
        resize();
        draw(0, 0.016);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [targetRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="singularity-canvas pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
