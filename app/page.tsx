"use client";

import { signIn, useSession } from "@/lib/auth-client";
import {
  IconArrowRight,
  IconBrandGithub,
  IconChartBar,
  IconCheck,
  IconClockHour4,
  IconFlame,
  IconGauge,
  IconLink,
  IconLock,
  IconRocket,
  IconSparkles,
  IconBolt,
  IconPalette,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { NeoButton } from "@/components/ui/neo-button";

const socialProof = [
  { icon: IconBrandGithub, label: "Syncs with GitHub" },
  { icon: IconBolt, label: "Live LeetCode stats" },
  { icon: IconFlame, label: "Setup in 2 minutes" },
];

const trustIndicators = [
  "Free for individuals",
  "GitHub sign-in",
  "No credit card required",
];

const stats = [
  {
    icon: IconClockHour4,
    value: "2 min",
    label: "average setup",
    accent: "bg-[#ffde7a]",
  },
  {
    icon: IconBolt,
    value: "Zero",
    label: "manual updates needed",
    accent: "bg-[#9af6e8]",
  },
  {
    icon: IconLock,
    value: "100%",
    label: "privacy-friendly analytics",
    accent: "bg-[#ffb5cf]",
  },
];

const features = [
  {
    icon: IconLink,
    title: "Your footprint, consolidated.",
    copy: "Bring your GitHub, LinkedIn, Twitter/X, and personal projects into a single, beautifully designed interface.",
  },
  {
    icon: IconChartBar,
    title: "Know exactly who is clicking.",
    copy: "Track page views, click-through rates (CTR), and traffic sources with our privacy-friendly analytics dashboard.",
  },
  {
    icon: IconPalette,
    title: "Make it yours (without CSS).",
    copy: "Choose from premium, developer-centric themes including terminal, cyberpunk, minimalist, and sleek dark modes.",
  },
];

const cardMotion = {
  animate: {
    y: [0, -10, 0],
    rotate: [-1, 1, -1],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function LandingPage() {
  const { data: session, isPending } = useSession();

  const handleCTA = () => {
    if (session) {
      window.location.href = "/dashboard";
      return;
    }

    signIn.social({ provider: "github", callbackURL: "/dashboard" });
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f5f3ea] text-[#10172b] selection:bg-[#11d7d1]/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(17,215,209,0.18),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(255,111,49,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.75),rgba(245,243,234,0))]" />

      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-3 right-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-[1.35rem] border-[3px] border-[#10172b] bg-[#fffdf5]/90 px-4 py-3 shadow-[6px_6px_0_#10172b] backdrop-blur md:left-6 md:right-6 md:px-5"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex cursor-pointer items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#11d7d1]"
          aria-label="Scroll to top"
        >
          <span className="flex size-9 items-center justify-center rounded-xl border-[3px] border-[#10172b] bg-[#ff6f31] font-black shadow-[3px_3px_0_#10172b]">
            e
          </span>
          <span className="text-lg font-black tracking-tight">endpnt.</span>
        </button>

        <div className="hidden items-center gap-2 text-sm font-bold md:flex">
          <a
            className="rounded-full px-3 py-2 transition-colors hover:bg-[#e9e5d8]"
            href="#features"
          >
            Features
          </a>
          <a
            className="rounded-full px-3 py-2 transition-colors hover:bg-[#e9e5d8]"
            href="#proof"
          >
            Metrics
          </a>
          <a
            className="rounded-full px-3 py-2 transition-colors hover:bg-[#e9e5d8]"
            href="#launch"
          >
            Why ENDPNT
          </a>
        </div>

        <NeoButton
          onClick={handleCTA}
          disabled={isPending}
          size="sm"
          variant="primary"
        >
          {session ? "Dashboard" : "Claim Your URL"}
          <IconArrowRight
            data-icon="inline-end"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </NeoButton>
      </motion.nav>

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-center px-5 pb-10 pt-24 text-center sm:px-8 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-3"
        >
          {socialProof.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border-[3px] border-[#10172b] bg-white px-4 py-2 text-xs font-black shadow-[4px_4px_0_#10172b] sm:text-sm"
            >
              <Icon className="text-[#ff6f31]" />
              {label}
            </div>
          ))}
        </motion.div>

        <motion.div
          {...cardMotion}
          className="absolute left-4 top-32 hidden w-48 rounded-[1.5rem] border-4 border-[#10172b] bg-white p-4 text-left shadow-[9px_9px_0_#10172b] lg:block lg:-left-6 lg:top-24 xl:-left-12 xl:top-28"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-[#ffde7a] px-3 py-1 text-xs font-black">
              Live Commits
            </span>
            <IconBrandGithub className="text-[#10172b]" />
          </div>
          <div className="h-3 w-24 rounded-full bg-[#10172b]" />
          <div className="mt-3 grid grid-cols-4 items-end gap-2">
            {[48, 76, 54, 94].map((height) => (
              <div
                key={height}
                className="rounded-t-lg border-[3px] border-[#10172b] bg-[#11d7d1]"
                style={{ height }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [1, -1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 right-4 hidden w-52 rounded-[1.5rem] border-4 border-[#10172b] bg-[#ffde7a] p-4 text-left shadow-[9px_9px_0_#10172b] lg:block lg:-right-6 lg:bottom-20 xl:-right-10 xl:bottom-24"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl border-[3px] border-[#10172b] bg-white">
              <IconSparkles />
            </span>
            <div>
              <p className="text-sm font-black">Launch checklist</p>
              <p className="text-xs font-bold opacity-70">3 of 3 complete</p>
            </div>
          </div>
          {["Claim endpoint", "Connect stack", "Share & track"].map((item) => (
            <div
              key={item}
              className="mt-2 flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 font-bold"
            >
              <IconCheck className="text-[#0b998f]" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl"
        >
          <div className="pointer-events-none absolute -left-8 top-4 size-5 rotate-12 rounded-md border-[3px] border-[#10172b] bg-[#ffb5cf] shadow-[3px_3px_0_#10172b] sm:-left-14 sm:size-8" />
          <div className="pointer-events-none absolute -right-6 bottom-8 size-7 rounded-full border-[3px] border-[#10172b] bg-[#9af6e8] shadow-[3px_3px_0_#10172b] sm:-right-12 sm:size-10" />
          <h1 className="text-balance text-[clamp(2.6rem,8.6vw,7.2rem)] font-black leading-[0.9] tracking-tight uppercase">
            One URL. <br />
            Entire
            <span className="relative mx-3 inline-block -rotate-1 rounded-[1.4rem] border-4 border-[#10172b] bg-[#ff6f31] px-3 pb-2 pt-1 text-white shadow-[8px_8px_0_#10172b] normal-case">
              identity.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.38 }}
          className="mt-5 max-w-2xl text-balance text-base font-semibold leading-7 text-[#394057] sm:text-lg"
        >
          Stop juggling a Linktree, a stale portfolio, and your GitHub README.
          ENDPNT is the ultimate hub for your projects, socials, and dev
          stats powered by deep link analytics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5 }}
          className="mt-6 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          <NeoButton
            onClick={handleCTA}
            disabled={isPending}
            size="lg"
            variant="primary"
          >
            {session ? "Open dashboard" : "Claim Your URL"}
            <IconRocket
              data-icon="inline-end"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </NeoButton>
          {!session && (
            <NeoButton
              onClick={handleCTA}
              disabled={isPending}
              size="lg"
              variant="secondary"
            >
              <IconBrandGithub data-icon="inline-start" />
              Continue with GitHub
            </NeoButton>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.65 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-3"
        >
          {trustIndicators.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 text-sm font-extrabold text-[#394057]"
            >
              <IconCheck className="text-[#0b998f]" />
              {item}
            </span>
          ))}
        </motion.div>
      </section>

      <motion.section
        id="proof"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-5 px-5 pb-20 sm:px-8 md:grid-cols-3"
      >
        {stats.map(({ icon: Icon, value, label, accent }) => (
          <div
            key={label}
            className="group rounded-[1.6rem] border-4 border-[#10172b] bg-white p-6 text-left shadow-[8px_8px_0_#10172b] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_12px_0_#10172b]"
          >
            <div
              className={`mb-8 flex size-12 items-center justify-center rounded-2xl border-[3px] border-[#10172b] ${accent}`}
            >
              <Icon />
            </div>
            <p className="text-5xl font-black tracking-tight">{value}</p>
            <p className="mt-2 text-base font-extrabold text-[#394057]">
              {label}
            </p>
          </div>
        ))}
      </motion.section>

      <motion.section
        id="features"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="relative z-10 border-y-4 border-[#10172b] bg-[#fffdf5] px-5 py-20 sm:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="inline-flex rounded-full border-[3px] border-[#10172b] bg-[#ffb5cf] px-4 py-2 text-sm font-black shadow-[4px_4px_0_#10172b]">
                Developer First
              </span>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-black leading-none tracking-tight sm:text-6xl">
                Show, don't just tell.
              </h2>
            </div>
            <p className="max-w-sm text-lg font-semibold leading-8 text-[#394057]">
              Let your live coding metrics, stats, and repositories do the
              talking for you without writing a single line of CSS.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, copy }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-[1.6rem] border-4 border-[#10172b] bg-[#f5f3ea] p-6 shadow-[8px_8px_0_#10172b] transition-all duration-200 hover:-translate-y-1 hover:bg-white"
              >
                <div className="mb-10 flex size-14 items-center justify-center rounded-2xl border-[3px] border-[#10172b] bg-[#11d7d1] shadow-[4px_4px_0_#10172b]">
                  <Icon />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                <p className="mt-4 text-base font-semibold leading-7 text-[#394057]">
                  {copy}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="launch"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border-4 border-[#10172b] bg-[#10172b] p-3 shadow-[10px_10px_0_#ff6f31]">
            <div className="rounded-[1.4rem] border-[3px] border-white/20 bg-[#f5f3ea] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="size-3 rounded-full bg-[#ff6f31]" />
                  <span className="size-3 rounded-full bg-[#ffde7a]" />
                  <span className="size-3 rounded-full bg-[#11d7d1]" />
                </div>
                <span className="rounded-full border-[3px] border-[#10172b] bg-white px-3 py-1 text-xs font-black">
                  endpnt.dev/johndoe
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.25rem] border-[3px] border-[#10172b] bg-white p-4 shadow-[5px_5px_0_#10172b]">
                  <div className="mb-4 size-16 rounded-2xl border-[3px] border-[#10172b] bg-[#ffb5cf]" />
                  <div className="h-4 w-32 rounded-full bg-[#10172b]" />
                  <div className="mt-3 h-3 w-44 max-w-full rounded-full bg-[#c8c6ba]" />
                  <div className="mt-6 flex flex-col gap-3">
                    {["Portfolio", "GitHub", "Resume"].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border-[3px] border-[#10172b] bg-[#f5f3ea] px-3 py-2 text-sm font-black"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.25rem] border-[3px] border-[#10172b] bg-[#11d7d1] p-4 shadow-[5px_5px_0_#10172b]">
                  <div className="flex items-center justify-between">
                    <p className="font-black">Live Stats</p>
                    <IconChartBar />
                  </div>
                  <div className="mt-7 grid grid-cols-7 items-end gap-2">
                    {[42, 64, 52, 76, 58, 92, 72].map((height) => (
                      <div
                        key={height}
                        className="rounded-t-xl border-[3px] border-[#10172b] bg-white"
                        style={{ height }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl border-[3px] border-[#10172b] bg-white p-4">
                    <p className="text-sm font-black">Top Repo</p>
                    <p className="mt-1 text-3xl font-black tracking-tight">
                      endpnt-web
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full border-[3px] border-[#10172b] bg-[#ffde7a] px-4 py-2 text-sm font-black shadow-[4px_4px_0_#10172b]">
              Built for developers who ship.
            </span>
            <h2 className="text-balance text-4xl font-black leading-none tracking-tight sm:text-6xl">
              Why not just use Linktree or build a portfolio?
            </h2>
            <p className="text-lg font-semibold leading-8 text-[#394057]">
              Linktree doesn't understand code, and updating a custom portfolio
              every time you launch takes too much time. Give your work the home
              it deserves with automatic syncing and analytics.
            </p>
            <NeoButton
              onClick={handleCTA}
              disabled={isPending}
              size="lg"
              variant="accent"
            >
              {session ? "Open dashboard" : "Create Your Free Profile"}
              <IconArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </NeoButton>
          </div>
        </div>
      </motion.section>

      <footer className="relative z-10 border-t-4 border-[#10172b] bg-[#fffdf5] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xl font-black tracking-tight uppercase">endpnt.</p>
          <p className="text-sm font-bold text-[#394057]">
            © {new Date().getFullYear()} endpnt. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
