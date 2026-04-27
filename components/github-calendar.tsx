"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

export function GithubCalendar({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full p-5 sm:p-6 rounded-2xl border border-border/40 bg-card/10 backdrop-blur-md hover:border-foreground/30 transition-colors overflow-x-auto">
      <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2 mb-4">
        GitHub Activity
      </h2>
      <GitHubCalendar
        username={username}
        colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
        fontSize={12}
        blockSize={14}
        blockMargin={4}
      />
    </div>
  );
}
