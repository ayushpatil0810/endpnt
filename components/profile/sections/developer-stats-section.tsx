import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GithubStatsSkeleton, LeetcodeStatsSkeleton } from "@/components/profile-skeletons";
import { ThemedCard } from "../themed-card";

const GithubStats = dynamic(
  () => import("@/components/GithubStats").then(mod => mod.GithubStats),
  { loading: () => <GithubStatsSkeleton /> }
);

const LeetcodeStats = dynamic(
  () => import("@/components/leetcode-stats").then(mod => mod.LeetcodeStats),
  { loading: () => <LeetcodeStatsSkeleton /> }
);
import type { ThemeDefinition } from "@/lib/themes";
import type { User } from "../types";

interface DeveloperStatsSectionProps {
  user: User;
  theme: ThemeDefinition;
}

function StatCard({
  theme,
  children,
}: {
  theme: ThemeDefinition;
  children: React.ReactNode;
}) {
  return (
    <ThemedCard theme={theme} className="h-full overflow-hidden">
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
  const hasGithub = !!user.githubUsername;
  const hasLeetcode = !!user.leetcodeUsername;

  if (!hasGithub && !hasLeetcode) return null;
  const colClass = hasGithub && hasLeetcode ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4 sm:gap-6`}>
      {hasGithub && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <StatCard theme={theme}>
            <ErrorBoundary fallbackMessage="Failed to load GitHub stats">
              <Suspense fallback={<GithubStatsSkeleton />}>
                <GithubStats username={user.githubUsername!} />
              </Suspense>
            </ErrorBoundary>
          </StatCard>
        </div>
      )}
      {hasLeetcode && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
          <StatCard theme={theme}>
            <ErrorBoundary fallbackMessage="Failed to load LeetCode stats">
              <Suspense fallback={<LeetcodeStatsSkeleton />}>
                <LeetcodeStats username={user.leetcodeUsername!} />
              </Suspense>
            </ErrorBoundary>
          </StatCard>
        </div>
      )}
    </div>
  );
}
