'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, Home, Search } from 'lucide-react';

function FloatingOrbs() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_24%),linear-gradient(180deg,rgba(4,8,20,0.7),rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[5.5rem_5.5rem] opacity-[0.05] mask-[radial-gradient(circle_at_center,black,transparent_82%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_36%,rgba(2,6,23,0.72)_100%)]" />

      <div className="orb orb-a absolute -left-56 -top-40 h-112 w-md rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="orb orb-b absolute -right-48 top-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="orb orb-c absolute -bottom-56 left-[18%] h-88 w-88 rounded-full bg-indigo-500/18 blur-3xl" />
    </div>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
  tone = 'primary',
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: 'primary' | 'secondary';
}) {
  const toneClasses =
    tone === 'primary'
      ? 'border-white/15 bg-white text-slate-950 shadow-[0_18px_60px_rgba(255,255,255,0.12)] hover:border-white/30 hover:bg-white/95'
      : 'border-white/10 bg-white/5 text-white/90 hover:border-cyan-400/30 hover:bg-white/10';

  return (
    <Link
      href={href}
      className={`group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium tracking-wide backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 sm:w-auto ${toneClasses}`}
    >
      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {label}
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
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium tracking-wide text-white/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10 sm:w-auto"
    >
      <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
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
      className="w-full sm:max-w-md"
      role="search"
      aria-label="Search the site"
    >
      <div className="relative flex items-center gap-2">
        <span className="absolute left-3 text-white/60">
          <Search className="h-4 w-4" />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the site..."
          className="w-full rounded-full border border-white/8 bg-white/4 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
        />
      </div>
    </form>
  );
}

export function NotFoundScene() {
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#03060f] text-white"
      aria-labelledby="not-found-title"
    >
      <FloatingOrbs />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-6 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_30%)]" />
            <h1 id="not-found-title" className="sr-only">
              Page not found
            </h1>

            <div className="relative lg:hidden">
              <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/68"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.7)]" />
                  Lost in space
                </motion.div>

                <motion.h1
                  initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(10px)' }}
                  animate={
                    reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }
                  transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 bg-[linear-gradient(180deg,#ffffff_0%,#e2e8f0_50%,#67e8f9_100%)] bg-clip-text text-[clamp(4.1rem,28vw,6.8rem)] font-semibold leading-none -tracking-widest text-transparent [text-shadow:0_0_40px_rgba(56,189,248,0.12)]"
                >
                  <motion.span
                    whileHover={reduceMotion ? undefined : { scale: 1.03, rotate: -1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                    className="inline-block"
                  >
                    404
                  </motion.span>
                </motion.h1>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.14 }}
                  className="mt-4 space-y-3"
                >
                  <p className="text-balance text-2xl font-medium tracking-tighter text-white/96">
                    Page not found.
                  </p>
                  <p className="mx-auto max-w-sm text-pretty text-sm leading-7 text-white/64">
                    The page you requested does not exist, moved, or was never linked.
                  </p>
                </motion.div>

                <div className="mt-6 flex w-full flex-col items-center gap-4">
                  <SearchForm />
                  <div className="w-full mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:w-auto">
                    <ActionLink href="/" icon={Home} label="Go Home" />
                    <GoBackButton />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/68"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.7)]" />
                  Lost in space
                </motion.div>

                <motion.h1
                  initial={reduceMotion ? false : { opacity: 0, y: 24, filter: 'blur(10px)' }}
                  animate={
                    reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }
                  transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 bg-[linear-gradient(180deg,#ffffff_0%,#e2e8f0_50%,#67e8f9_100%)] bg-clip-text text-[clamp(5rem,20vw,11rem)] font-semibold leading-none tracking-[-0.09em] text-transparent [text-shadow:0_0_40px_rgba(56,189,248,0.12)]"
                >
                  <motion.span
                    whileHover={reduceMotion ? undefined : { scale: 1.02, rotate: -0.6 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 12 }}
                    className="inline-block"
                  >
                    404
                  </motion.span>
                </motion.h1>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.14 }}
                  className="mt-4 space-y-4"
                >
                  <p className="text-balance text-2xl font-medium tracking-tighter text-white/96 sm:text-4xl lg:text-5xl">
                    Page not found.
                  </p>
                  <p className="mx-auto max-w-xl text-pretty text-sm leading-7 text-white/64 sm:text-lg sm:leading-8">
                    The page you requested does not exist, moved, or was never linked. Head back to
                    the start using the buttons below.
                  </p>
                </motion.div>

                <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
                  <div className="w-full sm:w-auto">
                    <SearchForm />
                  </div>
                  <div className="flex w-full sm:w-auto sm:items-center sm:gap-3">
                    <ActionLink href="/" icon={Home} label="Go Home" />
                    <GoBackButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
