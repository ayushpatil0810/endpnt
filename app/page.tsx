"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { IconBrandGithub, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex-1 flex flex-col bg-black min-h-dvh overflow-hidden relative selection:bg-primary/20">
      
      {/* Prismatic Aurora Burst - Multi-layered Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />

      {/* Nav */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-6 sm:px-12 py-6 w-full absolute top-0 z-20"
      >
        <div className="font-bold text-xl tracking-tighter uppercase text-foreground">Endpoint.</div>
        {isPending ? (
          <div className="w-20" />
        ) : session ? (
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-muted-foreground transition-colors uppercase tracking-widest text-foreground flex items-center gap-2"
          >
            Dashboard <IconArrowRight size={14} />
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className="text-sm font-medium hover:text-muted-foreground transition-colors uppercase tracking-widest text-foreground"
          >
            Sign in
          </Link>
        )}
      </motion.nav>

      <main className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-32 max-w-[1600px] w-full mx-auto relative z-10 min-h-dvh pb-20 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-end h-full mt-auto">
          
          {/* Main Typography Column */}
          <div className="lg:col-span-8 flex flex-col gap-12 sm:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[12vw] sm:text-[9vw] lg:text-[7rem] leading-[0.85] tracking-tighter font-medium text-foreground uppercase">
                Your Links. <br/>
                <span className="text-muted-foreground italic normal-case font-serif tracking-normal">Your <span className="text-foreground">Brand.</span></span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-md flex flex-col gap-8 sm:gap-10"
            >
              <p className="text-muted-foreground/90 leading-relaxed font-mono tracking-wide text-sm md:text-base">
                Create a stunning bio link page in seconds. Share your portfolio, socials, and everything that matters — all from one beautiful link.
              </p>
              
              <button
                onClick={() =>
                  session ? window.location.href = "/dashboard" : signIn.social({ provider: "github", callbackURL: "/dashboard" })
                }
                className="group flex flex-col w-fit items-start gap-4"
              >
                <div className="flex items-center gap-6 bg-foreground text-background font-semibold px-8 py-4 hover:bg-muted-foreground transition-all">
                  <span className="uppercase tracking-widest text-sm">
                    {session ? "Go to Dashboard" : "Get Started"}
                  </span>
                  <IconArrowRight className="group-hover:translate-x-2 transition-transform" stroke={1.5} size={20} />
                </div>
                {!session && (
                  <div className="text-[12px] font-mono text-muted-foreground tracking-widest uppercase items-center flex">
                    <IconBrandGithub size={14} className="inline mr-2" />
                    Connect with GitHub
                  </div>
                )}
              </button>
            </motion.div>
          </div>

          {/* Abstract / Minimal Visual Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex justify-start lg:justify-center items-end"
          >
            <div className="w-full max-w-[340px] aspect-[1/1.3] border border-border/30 bg-card/10 p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Preview</div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="flex flex-col gap-6 w-full mt-auto">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 flex items-center justify-center text-background font-serif italic text-2xl shadow-lg ring-4 ring-background/10">D</div>
                  <div className="flex flex-col">
                    <div className="font-medium text-lg tracking-tight text-foreground leading-tight">@developer</div>
                    <div className="text-xs text-muted-foreground/80 font-mono mt-0.5">Software Engineer</div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-border/40" />
                <div className="flex flex-col gap-3 mt-2 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 w-full border border-border/40 hover:border-foreground hover:bg-foreground hover:text-background transition-all flex items-center px-5 font-medium text-sm rounded-xl cursor-pointer">
                      My Project {i}
                      <IconArrowRight size={16} className="ml-auto opacity-50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
