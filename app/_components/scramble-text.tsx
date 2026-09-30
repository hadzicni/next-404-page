'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFXYZ';

/**
 * Renders `text` as-is on the server, then decodes it from random glyphs on
 * mount and again on hover. Screen readers only ever see the final text.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [scrambled, setScrambled] = useState<string | null>(null);
  const frameRef = useRef(0);

  const run = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const duration = 700 + text.length * 25;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(progress * text.length);
      if (progress >= 1) {
        setScrambled(null);
        return;
      }
      setScrambled(
        Array.from(text, (char, i) =>
          i < revealed || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(''),
      );
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    const timeout = window.setTimeout(run, delay);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [run, delay]);

  return (
    <span className={className} onPointerEnter={run}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{scrambled ?? text}</span>
    </span>
  );
}
