"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IconCheck, IconX, IconLoader2, IconArrowRight } from "@tabler/icons-react";
import { toast } from "sonner";
import { motion } from "motion/react";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function OnboardingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validFormat, setValidFormat] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(val);
    setError("");
    if (val.length === 0) {
      setValidFormat(null);
    } else {
      setValidFormat(USERNAME_REGEX.test(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!USERNAME_REGEX.test(username)) {
      setError("Username must be 3–20 characters: lowercase letters, numbers, underscores only.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      toast.success(`Username @${username} claimed!`);
      router.push("/dashboard");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-dvh bg-background">
        <IconLoader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center min-h-dvh bg-background px-8 sm:px-16 overflow-hidden relative">
      <div className="w-full max-w-xl mx-auto z-10">
        
        {/* Brand */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 font-bold text-sm tracking-widest uppercase text-muted-foreground"
        >
          LinkSnap.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight mb-4 uppercase">
            Pick Your Username
          </h1>
          <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase mb-16">
            This will be your unique Endpoint URL.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="flex flex-col gap-12"
        >
          <div className="relative group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
              endpoint.com/
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleChange}
              placeholder="username"
              maxLength={20}
              className="w-full bg-transparent border-b-2 border-border focus:border-foreground py-4 pl-[140px] pr-10 text-xl font-medium text-foreground placeholder:-ml-2 placeholder:text-muted-foreground/30 focus:outline-none transition-all rounded-none"
              autoComplete="off"
              autoCapitalize="none"
              autoFocus
            />
            {validFormat !== null && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-background pl-2">
                {validFormat ? (
                  <IconCheck size={20} className="text-foreground" />
                ) : (
                  <IconX size={20} className="text-destructive" />
                )}
              </div>
            )}
            
            {/* Animated underline focus effect */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-foreground w-0 group-focus-within:w-full transition-all duration-500 ease-out" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-col gap-2 max-w-sm">
              <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                Rules: 3–20 chars. Lowercase a-z, 0-9, and underscores.
              </p>
              {error && (
                <p className="text-xs text-destructive font-mono uppercase tracking-wider">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !username || !validFormat}
              className="group flex items-center gap-4 bg-foreground text-background font-medium px-8 py-4 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-muted-foreground"
            >
              <span className="uppercase tracking-widest text-xs">Verify</span>
              {loading ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </motion.form>
      </div>

      {/* Aesthetic grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
      />
    </div>
  );
}
