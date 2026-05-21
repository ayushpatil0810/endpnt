import { Suspense } from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { ThemedCard } from "../themed-card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GithubCalendarSkeleton } from "@/components/profile-skeletons";

const GithubCalendar = dynamic(
  () => import("@/components/github-calendar").then((mod) => mod.GithubCalendar),
  { 
    loading: () => <GithubCalendarSkeleton />
  }
);
import type { ThemeDefinition } from "@/lib/themes";
import type { User } from "../types";

interface GithubCalendarSectionProps {
  user: User;
  theme: ThemeDefinition;
}

/**
 * Wraps the GitHub contribution calendar in a themed card with a labeled
 * header. Returns null when no GitHub username is set.
 */
export function GithubCalendarSection({ user, theme }: GithubCalendarSectionProps) {
  if (!user.githubUsername) return null;

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
      <ThemedCard theme={theme} className="flex flex-col gap-4 p-6 sm:p-8 h-full">
        <div className="flex items-center gap-2">
          <IconBrandGithub
            size={18}
            style={{ color: "var(--theme-text-secondary)" }}
          />
          <h2
            className="text-[10px] font-mono tracking-widest uppercase"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Contributions
          </h2>
        </div>
        <ErrorBoundary fallbackMessage="Failed to load GitHub calendar">
          <Suspense fallback={<GithubCalendarSkeleton />}>
            <GithubCalendar username={user.githubUsername} />
          </Suspense>
        </ErrorBoundary>
      </ThemedCard>
    </div>
  );
}
