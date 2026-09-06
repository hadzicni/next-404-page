'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ArrowRight, ChevronLeft, Home, Search } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060f]';

const pillBase = `group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium tracking-wide backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto ${focusRing}`;

function Backdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_24%),linear-gradient(180deg,rgba(4,8,20,0.7),rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-size-[5.5rem_5.5rem] opacity-[0.06] mask-[radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_36%,rgba(2,6,23,0.72)_100%)]" />

      <div className="orb orb-a absolute -left-56 -top-40 h-112 w-md rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="orb orb-b absolute -right-48 top-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="orb orb-c absolute -bottom-56 left-[18%] h-88 w-88 rounded-full bg-indigo-500/18 blur-3xl" />
    </div>
  );
}

function GoHomeLink() {
  return (
    <Link
      href="/"
      className={`${pillBase} border-white/15 bg-white text-slate-950 shadow-[0_18px_60px_rgba(255,255,255,0.12)] hover:border-white/30 hover:bg-white/95 hover:shadow-[0_22px_70px_rgba(255,255,255,0.18)]`}
    >
      <Home className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      Go Home
    </Link>
  );
}

function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push('/');
      }}
      className={`${pillBase} border-white/10 bg-white/5 text-white/90 hover:border-cyan-400/30 hover:bg-white/10`}
    >
      <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      Go Back
    </button>
  );
}

function SearchForm() {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!q) return router.push('/');
        router.push(`/?q=${encodeURIComponent(q)}`);
      }}
      className="w-full max-w-md"
      role="search"
      aria-label="Search the site"
    >
      <div className="group relative flex items-center">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 h-4 w-4 text-white/45 transition-colors duration-300 group-focus-within:text-cyan-300"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the site..."
          aria-label="Search the site"
          className="h-12 w-full rounded-full border border-white/12 bg-white/[0.07] pl-11 pr-14 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors duration-300 placeholder:text-white/45 hover:border-white/20 focus:border-cyan-400/40 focus:bg-white/[0.09] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          aria-label="Search"
          className={`absolute right-1.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/20 hover:text-white ${focusRing}`}
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}

export function NotFoundScene() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03060f] text-white">
      <Backdrop />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <section className="reveal w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/[0.045] px-6 py-10 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_30%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)]"
            />

            <div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center">
              <p className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/70 sm:px-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.7)]" />
                Lost in space
              </p>

              <h1 className="reveal reveal-2 mt-5 sm:mt-6">
                <span className="sr-only">404 &ndash; Page not found</span>
                <span
                  aria-hidden="true"
                  className="block bg-[linear-gradient(180deg,#ffffff_0%,#e2e8f0_50%,#67e8f9_100%)] bg-clip-text text-[clamp(4.5rem,21vw,10.5rem)] font-semibold leading-none tracking-[-0.08em] text-transparent [text-shadow:0_0_40px_rgba(56,189,248,0.12)]"
                >
                  404
                </span>
              </h1>

              <p className="reveal reveal-3 mt-4 text-balance text-2xl font-medium tracking-tight text-white/95 sm:text-4xl lg:text-5xl">
                Page not found.
              </p>
              <p className="reveal reveal-3 mt-4 max-w-sm text-pretty text-sm leading-7 text-white/65 sm:max-w-lg sm:text-base sm:leading-8">
                The page you requested does not exist, moved, or was never linked.
              </p>

              <div className="reveal reveal-4 mt-8 flex w-full flex-col items-center gap-4">
                <SearchForm />
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <GoHomeLink />
                  <GoBackButton />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
