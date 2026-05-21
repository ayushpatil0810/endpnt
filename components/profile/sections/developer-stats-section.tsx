import { Suspense } from "react";
import { GithubStats } from "@/components/GithubStats";
import { LeetcodeStats } from "@/components/leetcode-stats";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GithubStatsSkeleton, LeetcodeStatsSkeleton } from "@/components/profile-skeletons";
import { ThemedCard } from "../themed-card";
import type { ThemeDefinition } from "@/lib/themes";
import type { User } from "../types";

interface DeveloperStatsSectionProps {
  user: User;
  theme: ThemeDefinition;
}

function StatCard({
  title,
  theme,
  children,
}: {
  title: string;
  theme: ThemeDefinition;
  children: React.ReactNode;
}) {
  return (
    <ThemedCard theme={theme} className="flex flex-col gap-4 p-6 h-full">
      <h2
        className="text-[10px] font-mono tracking-widest uppercase pb-3"
        style={{
          color: "var(--theme-text-secondary)",
          borderBottom: "1px solid var(--theme-separator)",
        }}
      >
        {title}
      </h2>
      {children}
    </ThemedCard>
  );
}

/**
 * Renders GitHub and/or LeetCode stat cards side-by-side.
 * Returns null if the user hasn't connected either platform.
 * Each card is independently suspended and error-bounded so a failed
 * third-party API doesn't take down the whole section.
 */
export function DeveloperStatsSection({ user, theme }: DeveloperStatsSectionProps) {
  if (!user.githubUsername && !user.leetcodeUsername) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {user.githubUsername && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <StatCard title="GitHub" theme={theme}>
            <ErrorBoundary fallbackMessage="Failed to load GitHub stats">
              <Suspense fallback={<GithubStatsSkeleton />}>
                <GithubStats username={user.githubUsername} />
              </Suspense>
            </ErrorBoundary>
          </StatCard>
        </div>
      )}
      {user.leetcodeUsername && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
          <StatCard title="LeetCode" theme={theme}>
            <ErrorBoundary fallbackMessage="Failed to load LeetCode stats">
              <Suspense fallback={<LeetcodeStatsSkeleton />}>
                <LeetcodeStats username={user.leetcodeUsername} />
              </Suspense>
            </ErrorBoundary>
          </StatCard>
        </div>
      )}
    </div>
  );
}
