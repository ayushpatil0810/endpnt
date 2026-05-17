"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { IconBrandGithub, IconBolt, IconLink, IconChartBar, IconPalette } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import { NoiseBackground } from "@/components/ui/noise-background";
import DecryptedText from "@/components/ui/decrypted-text";
import PixelSnow from "@/components/PixelSnow";

const FEATURES = [
  {
    icon: IconLink,
    title: "Your professional footprint, consolidated.",
    description: "Bring your GitHub, LinkedIn, Twitter/X, and personal projects into a single, beautifully designed interface.",
    benefit: "Make it effortless for recruiters, collaborators, and followers to see your entire impact at a glance."
  },
  {
    icon: IconChartBar,
    title: "Know exactly who is clicking.",
    description: "Track page views, click-through rates (CTR), and traffic sources with our privacy-friendly analytics dashboard.",
    benefit: "Stop guessing if your portfolio is working. See exactly which projects and links are driving the most engagement."
  },
  {
    icon: IconBolt,
    title: "Live stats, zero manual updates.",
    description: "Connect your GitHub and LeetCode accounts to display live commit graphs, solved problems, and repository stars.",
    benefit: "Show, don't just tell. Let your live coding metrics do the talking for you."
  },
  {
    icon: IconPalette,
    title: "Make it yours (without writing CSS).",
    description: "Choose from premium, developer-centric themes including terminal, cyberpunk, minimalist, and sleek dark modes.",
    benefit: "Look like you spent weeks building a custom portfolio, in less than two minutes."
  }
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
              {session ? "Dashboard →" : "Claim Your URL →"}
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
                    Entire{" "}
                    <span className="text-white">identity.</span>
                  </span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.35 }}
                className="flex flex-col gap-8"
              >
                <p className="text-white/50 leading-relaxed font-mono text-sm md:text-base max-w-lg">
                  Stop juggling a Linktree, a stale portfolio, and your GitHub README. ENDPNT is the ultimate hub for your projects, socials, and dev stats—powered by deep link analytics.
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
                      {session ? "Go to Dashboard →" : "Claim Your URL →"}
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
                {!session && (
                  <p className="text-white/30 text-[10px] font-mono mt-[-1rem]">Free forever for individuals. Setup takes 2 minutes.</p>
                )}
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
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
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

        {/* ── Value Proposition ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto px-6 sm:px-16 py-16 sm:py-24 text-center flex flex-col items-center gap-6 relative"
        >
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent blur-3xl rounded-full opacity-50 z-[-1]"></div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full bg-white/5">Why endpnt</span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase mt-4">
            Built for developers who ship.
          </h2>
          <p className="text-white/50 leading-relaxed font-mono text-sm md:text-base max-w-2xl mt-2">
            You don't need a complex CMS to show off your work, and generic link-in-bio tools don't understand code. ENDPNT gives you a premium, data-driven profile that automatically syncs your developer stats and highlights your best projects.
          </p>
        </motion.section>

        {/* ── Features ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, description, benefit }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group flex flex-col gap-6 p-8 border border-white/8 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/16 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="size-12 rounded-xl bg-white/8 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/12 transition-all shadow-inner">
                  <Icon size={24} stroke={1.5} />
                </div>
                <div className="flex flex-col gap-3 z-10">
                  <h3 className="font-medium text-white text-lg tracking-wide">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-mono normal-case">{description}</p>
                  <p className="text-white/30 text-xs leading-relaxed normal-case mt-1 pt-4 border-t border-white/10 font-sans italic">
                    {benefit}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Differentiation ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-16 sm:py-24"
        >
          <div className="flex flex-col gap-3 mb-16">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
              Why not just use Linktree<br/>or build a portfolio?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 p-8 border border-white/5 rounded-xl bg-transparent">
              <h3 className="text-white/40 font-mono text-sm uppercase tracking-widest">Linktree</h3>
              <p className="text-white/70 text-lg">For influencers, not engineers.</p>
              <p className="text-white/40 text-sm font-mono mt-2">It can't show your GitHub commits, it doesn't understand repositories, and it looks incredibly generic.</p>
            </div>
            
            <div className="flex flex-col gap-4 p-8 border border-white/5 rounded-xl bg-transparent">
              <h3 className="text-white/40 font-mono text-sm uppercase tracking-widest">Custom Portfolio</h3>
              <p className="text-white/70 text-lg">Takes too much time.</p>
              <p className="text-white/40 text-sm font-mono mt-2">You shouldn't have to push code just to update a link or add a new side project. It gets stale quickly.</p>
            </div>
            
            <div className="flex flex-col gap-4 p-8 border border-white/10 rounded-xl bg-white/[0.02] shadow-[0_0_40px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">ENDPNT</h3>
              <p className="text-white text-lg">The perfect sweet spot.</p>
              <p className="text-white/60 text-sm font-mono mt-2">As fast to update as a link-in-bio, but packs the technical punch and visual appeal of a custom-coded dev portfolio.</p>
            </div>
          </div>
        </motion.section>



        {/* ── How It Works ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-16 sm:py-24"
        >
          <div className="flex flex-col gap-3 mb-16 text-center">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
              Shipping your profile is easier than a `git push`
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-px bg-white/10" />
            
            {[
              { step: 1, title: "Claim your endpoint.", desc: "Secure your unique username in seconds." },
              { step: 2, title: "Connect your stack.", desc: "Paste your links, add your projects, and authorize GitHub/LeetCode." },
              { step: 3, title: "Share and track.", desc: "Drop your ENDPNT link in your Twitter bio or resume and watch analytics." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 relative z-10">
                <div className="size-12 rounded-full bg-[#050505] border border-white/20 flex items-center justify-center text-white font-mono text-lg">
                  {item.step}
                </div>
                <h3 className="text-white text-lg font-medium">{item.title}</h3>
                <p className="text-white/50 text-sm font-mono max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Final CTA ── */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-24 sm:py-32 flex flex-col items-center justify-center text-center gap-8 relative"
        >
          <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full z-[-1] max-w-2xl mx-auto h-1/2 mt-20" />
          <h2 className="text-4xl sm:text-6xl font-medium tracking-tighter text-white uppercase max-w-3xl leading-[1.1]">
            Ready to upgrade your developer presence?
          </h2>
          <p className="text-white/50 font-mono max-w-xl text-lg">
            Stop sending people to a messy list of links. Give your work the home it deserves.
          </p>
          
          <NoiseBackground
            containerClassName="w-fit p-2 rounded-full mt-4"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <button
              onClick={handleCTA}
              className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-8 py-4 text-base font-bold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-95 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] uppercase tracking-wider"
            >
              {session ? "Go to Dashboard" : "Create Your Free Profile"}
            </button>
          </NoiseBackground>
          {!session && (
             <p className="text-white/30 text-[11px] font-mono tracking-widest uppercase mt-[-1rem]">No credit card required.</p>
          )}
        </motion.section>

        {/* ── Footer ── */}
        <footer className="w-full max-w-[1600px] mx-auto px-6 sm:px-16 lg:px-32 py-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-20">
          <span className="font-bold text-sm tracking-tighter uppercase text-white/40">endpnt.</span>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest normal-case">
            © {new Date().getFullYear()} endpnt. All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}
