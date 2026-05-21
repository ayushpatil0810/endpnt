import { HeroCard } from "../hero-card";
import { PublicLinkButton } from "@/app/[username]/public-link-button";
import { DeveloperStatsSection } from "../sections/developer-stats-section";
import { GithubCalendarSection } from "../sections/github-calendar-section";
import { ProjectsSection } from "../sections/projects-section";
import { ArticlesSection } from "../sections/articles-section";
import { GithubLanguages } from "@/components/GithubLanguages";
import { GithubTopRepos } from "@/components/GithubTopRepos";
import { GithubActivityFeed } from "@/components/GithubActivityFeed";
import type { ProfileLayoutProps } from "../types";

/**
 * Minimal Layout — single-column, centered, constrained width.
 * Ideal for link-heavy profiles that want a clean, Linktree-style feel.
 */
export function MinimalLayout({ user, userLinks, userProjects, theme }: ProfileLayoutProps) {
  return (
    <div className="max-w-[680px] w-full mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
      <HeroCard user={user} theme={theme} alignCenter />

      {userLinks.length > 0 && (
        <div className="flex flex-col gap-4">
          {userLinks.map((link, idx) => (
            <div
              key={link.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <PublicLinkButton link={link} themeId={theme.id} />
            </div>
          ))}
        </div>
      )}

      <DeveloperStatsSection user={user} theme={theme} />
      
      {user.githubUsername && (
        <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <GithubCalendarSection user={user} theme={theme} />
          <GithubTopRepos username={user.githubUsername} theme={theme} />
          <GithubLanguages username={user.githubUsername} theme={theme} />
          <GithubActivityFeed username={user.githubUsername} theme={theme} />
        </div>
      )}
      <ProjectsSection
        projects={userProjects}
        theme={theme}
        gridClass="flex flex-col gap-4"
      />
      <ArticlesSection user={user} theme={theme} />
    </div>
  );
}
