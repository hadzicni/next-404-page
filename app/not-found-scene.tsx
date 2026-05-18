'use client';

import { useState, type FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Home, Search } from 'lucide-react';

function FloatingOrbs() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_26%),linear-gradient(180deg,rgba(6,11,25,0.76),rgba(2,6,23,0.97))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[5.5rem_5.5rem] opacity-[0.06] mask-[radial-gradient(circle_at_center,black,transparent_82%)]" />

      <div className="orb orb-a absolute -left-56 -top-40 h-112 w-md rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="orb orb-b absolute -right-48 top-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
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
      className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium tracking-wide backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${toneClasses}`}
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
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium tracking-wide text-white/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
    >
      <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      Go Back
    </button>
  );
}

function QuickJumpForm() {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = value.trim();

    if (!trimmed) {
      window.location.assign('/');
      return;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      window.location.assign(trimmed);
      return;
    }

    const normalized = trimmed.startsWith('/')
      ? trimmed
      : `/${trimmed.replace(/^\/+/, '').replace(/\s+/g, '-')}`;

    window.location.assign(normalized);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative mt-2 flex w-full max-w-xl items-center gap-3 rounded-3xl border border-white/10 bg-white/6 p-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:border-white/15 hover:bg-white/8"
    >
      <label htmlFor="quick-jump" className="sr-only">
        Quick jump to a route or URL
      </label>
      <Search className="pointer-events-none absolute left-5 h-4 w-4 text-white/40" />
      <input
        id="quick-jump"
        name="quick-jump"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Try /, /blog, or any valid URL"
        className="h-12 flex-1 rounded-2xl border border-white/8 bg-slate-950/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-cyan-400/40 focus:bg-slate-950/65"
      />
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-400 px-5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(56,189,248,0.24)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        Jump
        <ArrowRight className="h-4 w-4" />
      </button>
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

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 sm:px-8 lg:px-10">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl"
        >
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="flex flex-col items-center space-y-5">
              <motion.h1
                id="not-found-title"
                initial={reduceMotion ? false : { opacity: 0, y: 24, filter: 'blur(10px)' }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl bg-[linear-gradient(180deg,#ffffff_0%,#cbd5e1_42%,#67e8f9_100%)] bg-clip-text text-[clamp(4.5rem,18vw,10.5rem)] font-semibold leading-none tracking-[-0.08em] text-transparent [text-shadow:0_0_40px_rgba(56,189,248,0.12)]"
              >
                404
              </motion.h1>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14 }}
                className="space-y-4"
              >
                <p className="max-w-xl text-balance text-3xl font-medium tracking-[-0.04em] text-white/95 sm:text-4xl lg:text-5xl">
                  Page Not Found
                </p>
                <p className="max-w-2xl text-pretty text-base leading-8 text-white/64 sm:text-lg">
                  The page you requested does not exist.
                </p>
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ActionLink href="/" icon={Home} label="Go Home" />
              <GoBackButton />
            </div>

            <div className="w-full max-w-xl">
              <QuickJumpForm />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
