"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

export function GithubCalendar({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full p-5 sm:p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md hover:border-foreground/30 transition-colors overflow-x-auto min-h-[160px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 w-full">
          <div className="h-4 w-32 bg-foreground/10 rounded-full self-start mb-2" />
          <div className="h-24 w-full bg-foreground/5 rounded-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5 sm:p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md hover:border-foreground/30 transition-colors overflow-x-auto">
      <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2 mb-4">
        GitHub Activity
      </h2>
      <GitHubCalendar
        username={username}
        colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
        fontSize={12}
        blockSize={14}
        blockMargin={4}
        throwOnError={true}
      />
    </div>
  );
}
