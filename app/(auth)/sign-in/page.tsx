"use client";

import { signIn } from "@/lib/auth-client";
import { IconBrandGithub, IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  async function handleGithubSignIn() {
    setLoading(true);
    try {
      await signIn.social({ provider: "github", callbackURL: "/dashboard" });
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center min-h-dvh bg-background px-8 sm:px-16 overflow-hidden relative">
      <div className="w-full max-w-xl mx-auto z-10 grid grid-cols-1 gap-12">
        
        {/* Brand */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="font-bold text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
            endpnt.
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight uppercase">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase">
            Sign in to manage your endpnt profile.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-8 mt-8 border-t border-border pt-12"
        >
          <button
            onClick={handleGithubSignIn}
            disabled={loading}
            className="group flex flex-col w-full items-start gap-4"
          >
            <div className="w-full flex items-center justify-between border border-border bg-card/10 hover:bg-foreground hover:border-foreground hover:text-background p-6 transition-all">
              <span className="uppercase tracking-widest text-sm font-medium">Continue with GitHub</span>
              {loading ? (
                <IconLoader2 size={20} className="animate-spin" />
              ) : (
                <IconArrowRight className="group-hover:translate-x-1 transition-transform" stroke={1.5} size={20} />
              )}
            </div>
            
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase flex items-center w-full justify-between">
              <span>Secure Authentication</span>
              <span><IconBrandGithub size={12} className="inline mr-1" /> OAuth</span>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Aesthetic grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
      />
    </div>
  );
}
