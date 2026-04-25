"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { IconBrandGithub, IconArrowRight, IconBolt, IconLink, IconChartBar, IconPalette } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NoiseBackground } from "@/components/ui/noise-background";
import DecryptedText from "@/components/ui/decrypted-text";
import PixelSnow from "@/components/PixelSnow";

const FEATURES = [
  {
    icon: IconLink,
    title: "One Endpoint",
    description:
      "Consolidate every link — your portfolio, socials, resume, and projects — behind a single, memorable URL.",
  },
  {
    icon: IconPalette,
    title: "Fully Themed",
    description:
      "Choose from curated visual themes: Aurora, Terminal, Velvet, and more. Your profile, your aesthetic.",
  },
  {
    icon: IconChartBar,
    title: "Click Analytics",
    description:
      "Real-time insights on profile views, link clicks, and CTR. Know exactly what's driving traffic.",
  },
  {
    icon: IconBolt,
    title: "Dev-First Integrations",
    description:
      "Sync your GitHub stats, LeetCode activity, and Dev.to posts. Built for engineers, by engineers.",
  },
];

export default function LandingPage() {
  const { data: session, isPending } = useSession();

  const handleCTA = () => {
    if (session) {
      window.location.href = "/dashboard";
    } else {
      signIn.social({ provider: "github", callbackURL: "/dashboard" });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black min-h-dvh overflow-x-hidden relative selection:bg-primary/20">

      {/* ── Pixel Snow Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>

      {/* ── Nav ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-6 sm:px-12 py-6 w-full absolute top-0 z-20"
      >
        <div className="font-bold text-xl tracking-tighter uppercase text-white">
          endpnt<span className="text-white/40">.</span>
        </div>

        {isPending ? (
          <div className="w-20" />
        ) : (
          <NoiseBackground
            containerClassName="w-fit p-1.5 rounded-full"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <button
              onClick={handleCTA}
              className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-5 py-2 text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-95 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
            >
              {session ? "Dashboard →" : "Get started →"}
            </button>
          </NoiseBackground>
        )}
      </motion.nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col relative z-10 min-h-dvh">

        {/* Top section */}
        <section className="flex flex-col justify-center px-6 sm:px-16 lg:px-32 max-w-[1600px] w-full mx-auto pt-36 pb-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Typography */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >


                <h1 className="text-[11vw] sm:text-[8vw] lg:text-[6.5rem] leading-[0.88] tracking-tighter font-medium text-white uppercase">
                  One URL.<br />
                  <span className="text-white/30 italic normal-case font-serif tracking-normal">
                    Every{" "}
                    <span className="text-white">link.</span>
                  </span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.35 }}
                className="flex flex-col gap-8"
              >
                <p className="text-white/50 leading-relaxed font-mono text-sm md:text-base max-w-sm">
                  endpnt gives you a single, beautiful profile page that houses all your links, dev stats, and content — ready to share in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Primary CTA */}
                  <NoiseBackground
                    containerClassName="w-fit p-2 rounded-full"
                    gradientColors={[
                      "rgb(255, 100, 150)",
                      "rgb(100, 150, 255)",
                      "rgb(255, 200, 100)",
                    ]}
                  >
                    <button
                      onClick={handleCTA}
                      className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-6 py-2.5 text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-95 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
                    >
                      {session ? "Go to Dashboard →" : "Start publishing →"}
                    </button>
                  </NoiseBackground>

                  {!session && (
                    <button
                      onClick={handleCTA}
                      className="flex items-center gap-2 text-[11px] font-mono text-white/40 hover:text-white/70 transition-colors tracking-widest uppercase"
                    >
                      <IconBrandGithub size={14} />
                      Continue with GitHub
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-[340px] h-auto border border-white/10 bg-[#050505] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-start w-full">
                  <div className="font-bold text-xs tracking-widest text-white uppercase">endpnt.</div>
                  <div className="text-[9px] font-mono tracking-widest text-white/30 uppercase">endpnt.dev/johndoe</div>
                </div>

                <div className="flex flex-col gap-6 mt-10 w-full relative z-10">
                  {/* Profile Header (matches dashboard aesthetic) */}
                  <div className="flex flex-col gap-4">
                    <div className="size-16 bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-serif italic text-white/40">
                      J
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium text-xl tracking-tight text-white uppercase">@JOHNDOE</div>
                      <div className="text-xs text-white/60 font-mono mt-2 leading-relaxed normal-case">Full-Stack Engineer building things for the web.</div>
                    </div>
                  </div>

                  {/* Links (matches LinkCard aesthetic) */}
                  <div className="flex flex-col w-full mt-2">
                    {[
                      { title: "Portfolio", url: "johndoe.dev", clicks: "1.2k" },
                      { title: "GitHub", url: "github.com/johndoe", clicks: "843" },
                      { title: "Resume", url: "read.cv/johndoe", clicks: "128" }
                    ].map((link, i) => (
                      <div
                        key={i}
                        className="w-full border-b border-white/10 py-3.5 flex flex-col gap-1.5 group"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="font-medium text-base tracking-tight text-white normal-case group-hover:text-white/70 transition-colors">
                          {link.title}
                        </div>
                        <div className="flex items-center gap-3">
                          <IconLink size={10} className="text-white/30" />
                          <span className="text-[10px] font-mono text-white/40 normal-case">{link.url}</span>
                          <span className="text-[10px] font-mono text-white/20 ml-auto">{link.clicks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Decrypted Text "endpnt" ── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="w-full max-w-[1600px] mx-auto px-6 sm:px-16"
        >
          <div className="h-40 sm:h-56 flex items-center justify-center overflow-hidden">
            <DecryptedText
              text="endpnt"
              speed={60}
              maxIterations={10}
              characters="ABCD1234!?"
              className="text-[15vw] sm:text-[12vw] lg:text-[14rem] leading-none tracking-tighter font-bold text-white uppercase"
              encryptedClassName="text-[15vw] sm:text-[12vw] lg:text-[14rem] leading-none tracking-tighter font-bold text-white/20 uppercase"
              parentClassName="all-letters"
              animateOn="hover"
            />
          </div>
        </motion.section>

        {/* ── Features ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-16 sm:py-24"
        >
          <div className="flex flex-col gap-3 mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Why endpnt</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase">
              Built for the modern developer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
                className="group flex flex-col gap-4 p-6 border border-white/8 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/16 transition-all duration-300"
              >
                <div className="size-10 rounded-xl bg-white/8 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/12 transition-all">
                  <Icon size={20} stroke={1.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-white text-sm tracking-wide uppercase">{title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed font-mono normal-case">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-bold text-sm tracking-tighter uppercase text-white/40">endpnt.</span>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest normal-case">
            © {new Date().getFullYear()} endpnt. All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}
