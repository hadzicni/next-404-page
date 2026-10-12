'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';

import { ScrambleText } from './_components/scramble-text';
import { SingularityCanvas } from './_components/singularity-canvas';
import { useMagnetic } from './_components/use-magnetic';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]';

const MARQUEE = ['Page not found', 'Lost in the void', 'Error 404', 'Nothing to see here', 'Signal lost'];

const noopSubscribe = () => () => {};

/**
 * The 404 is prerendered statically, so the server can't know the requested
 * path. Read it from the URL only after hydration to avoid a mismatch.
 */
function useRequestedPath() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.pathname,
    () => null,
  );
}

function useGoBack() {
  const router = useRouter();
  return useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  }, [router]);
}

/** Tracks the pointer into CSS vars (--mx/--my in px, --nx/--ny in -1..1) without re-rendering. */
function usePointerVars(rootRef: React.RefObject<HTMLElement | null>, coordsRef: React.RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      root.style.setProperty('--mx', `${x}px`);
      root.style.setProperty('--my', `${y}px`);
      root.style.setProperty('--nx', ((x / window.innerWidth) * 2 - 1).toFixed(4));
      root.style.setProperty('--ny', ((y / window.innerHeight) * 2 - 1).toFixed(4));
      if (coordsRef.current) {
        const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');
        coordsRef.current.textContent = `X ${pad(tx)}  Y ${pad(ty)}`;
      }
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [rootRef, coordsRef]);
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-md border border-white/15 bg-white/5 px-1 font-mono text-[0.65rem] text-white/70">
      {children}
    </kbd>
  );
}

function GlitchDigit({ delay }: { delay: string }) {
  return (
    <span className="digit-depth digit-float">
      <span className="glitch digit-enter" data-text="4" style={{ animationDelay: delay }}>
        <span className="digit-face">4</span>
      </span>
    </span>
  );
}

function Portal({ portalRef }: { portalRef: React.RefObject<HTMLSpanElement | null> }) {
  return (
    <span className="digit-depth">
      <span ref={portalRef} className="portal portal-enter">
        <span className="portal-glow" />
        <span className="portal-ring portal-ring-outer" />
        <span className="portal-ring" />
        <span className="portal-lens" />
        <span className="portal-core" />
      </span>
    </span>
  );
}

function HomeLink() {
  const ref = useMagnetic<HTMLAnchorElement>(0.25);
  return (
    <Link
      ref={ref}
      href="/"
      className={`magnetic group relative inline-flex h-13 w-full items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-sm font-medium text-black sm:w-auto ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full rounded-full bg-[linear-gradient(120deg,#ffedd5,#fb923c_45%,#f97316)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      />
      <span className="relative">Take me home</span>
      <span className="relative grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function BackButton() {
  const ref = useMagnetic<HTMLButtonElement>(0.25);
  const goBack = useGoBack();
  return (
    <button
      ref={ref}
      type="button"
      onClick={goBack}
      className={`magnetic group inline-flex h-13 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-white/85 backdrop-blur-xl transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.08] hover:text-white sm:w-auto ${focusRing}`}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      Go back
    </button>
  );
}

function SearchForm({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/?q=${encodeURIComponent(query)}` : '/');
      }}
      className="search-shell w-full max-w-md rounded-full p-px"
      role="search"
      aria-label="Search the site"
    >
      <div className="group relative flex items-center rounded-full bg-[#0b0b0c]/90 backdrop-blur-xl">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-5 h-4 w-4 text-white/40 transition-colors duration-300 group-focus-within:text-orange-300"
        />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search instead…"
          aria-label="Search the site"
          className="h-12 w-full rounded-full bg-transparent pl-12 pr-14 text-sm text-white placeholder:text-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <span className="pointer-events-none absolute right-4 hidden transition-opacity duration-200 group-focus-within:opacity-0 pointer-fine:inline-grid">
          <Kbd>/</Kbd>
        </span>
      </div>
    </form>
  );
}

export function NotFoundScene() {
  const pathname = useRequestedPath();
  const router = useRouter();
  const goBack = useGoBack();
  const rootRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLSpanElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  usePointerVars(rootRef, coordsRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        if (e.key === 'Escape') target.blur();
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'h') router.push('/');
      else if (key === 'b') goBack();
      else if (key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, goBack]);

  const path = pathname && pathname.length > 32 ? `${pathname.slice(0, 31)}…` : pathname;

  return (
    <main ref={rootRef} className="scene relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#050505] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_38%,rgba(249,115,22,0.16),transparent_70%)]" />
        <div className="dot-grid absolute inset-0" />
        <div className="spotlight absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <SingularityCanvas targetRef={portalRef} />

      <header className="reveal relative z-10 flex items-center justify-between px-5 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/50 sm:px-8 sm:pt-7">
        <span className="inline-flex items-center gap-2.5">
          <span className="signal-dot h-1.5 w-1.5 rounded-full bg-orange-400" />
          Signal lost
        </span>
        <span ref={coordsRef} aria-hidden="true" className="hidden tabular-nums pointer-fine:inline">
          X 0000&nbsp;&nbsp;Y 0000
        </span>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <p className="reveal reveal-1 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[0.7rem] text-white/60 backdrop-blur-md">
            <span className="text-orange-300">404</span>
            <span className="text-white/25">/</span>
            <ScrambleText text={path ? `GET ${path}` : 'NOT_FOUND'} delay={500} className="truncate" />
          </p>

          <h1 className="mt-4 sm:mt-6">
            <span className="sr-only">404 &ndash; Page not found</span>
            <span aria-hidden="true" className="tilt flex items-center justify-center text-[clamp(6.5rem,min(30vw,32vh),15rem)] font-semibold leading-none tracking-[-0.06em]">
              <GlitchDigit delay="0.15s" />
              <Portal portalRef={portalRef} />
              <GlitchDigit delay="0.3s" />
            </span>
          </h1>

          <p className="mt-6 text-balance text-4xl font-medium tracking-[-0.03em] sm:mt-8 sm:text-6xl">
            {['Lost', 'in', 'the'].map((word, i) => (
              <span key={word} className="word" style={{ animationDelay: `${0.7 + i * 0.08}s` }}>
                {word}{' '}
              </span>
            ))}
            <span className="word font-serif font-normal italic tracking-[-0.01em] text-orange-200" style={{ animationDelay: '0.94s' }}>
              void.
            </span>
          </p>

          <p className="reveal reveal-3 mt-5 max-w-md text-pretty text-sm leading-7 text-white/55 sm:text-base">
            Whatever you were looking for drifted past the event horizon. It may have moved, been deleted,
            or never existed at all.
          </p>

          <div className="reveal reveal-4 mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <HomeLink />
            <BackButton />
          </div>

          <div className="reveal reveal-5 mt-4 flex w-full justify-center">
            <SearchForm inputRef={searchRef} />
          </div>

          <p className="reveal reveal-5 mt-6 hidden items-center justify-center gap-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/35 pointer-fine:flex">
            <span className="inline-flex items-center gap-1.5"><Kbd>H</Kbd> home</span>
            <span className="inline-flex items-center gap-1.5"><Kbd>B</Kbd> back</span>
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="marquee relative z-0 select-none overflow-hidden pb-4">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {MARQUEE.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="marquee-text px-6 text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
                    {item}
                  </span>
                  <span className="text-2xl text-orange-400/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-50" />
    </main>
  );
}
