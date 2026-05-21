import { HeroCard } from "../hero-card";
import { ProjectCard } from "../project-card";
import { PublicLinkButton } from "@/app/[username]/public-link-button";
import { GithubCalendarSection } from "../sections/github-calendar-section";
import { DeveloperStatsSection } from "../sections/developer-stats-section";
import { ArticlesSection } from "../sections/articles-section";
import type { ProfileLayoutProps } from "../types";

/**
 * Bento Layout — dense, magazine-style grid.
 *
 * Uses CSS `grid-flow-row-dense` to pack cells efficiently.
 * The HeroCard spans 2 rows on large screens to anchor the left column.
 */
export function BentoLayout({ user, userLinks, userProjects, theme }: ProfileLayoutProps) {
  return (
    <div className="max-w-[1200px] w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10 auto-rows-max grid-flow-row-dense">
      {/* Hero — anchors top-left, spans 2 cols × 2 rows on lg */}
      <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:row-span-2">
        <HeroCard user={user} theme={theme} />
      </div>

      {/* Link buttons */}
      {userLinks.map((link, idx) => (
        <div
          key={link.id}
          className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
          style={{ animationDelay: `${(idx + 1) * 100}ms` }}
        >
          <PublicLinkButton link={link} themeId={theme.id} />
        </div>
      ))}

      {/* GitHub calendar */}
      {user.githubUsername && (
        <div className="col-span-2 md:col-span-4 lg:col-span-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <GithubCalendarSection user={user} theme={theme} />
        </div>
      )}

      {/* Dev stats — each card gets its own bento cell */}
      {user.githubUsername && (
        <div className="col-span-2 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
          <DeveloperStatsSection user={user} theme={theme} />
        </div>
      )}

      {/* Projects */}
      {userProjects.map((project, idx) => (
        <div
          key={project.id}
          className="col-span-2 md:col-span-2 lg:col-span-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
          style={{ animationDelay: `${(idx + 5) * 100}ms` }}
        >
          <ProjectCard project={project} theme={theme} />
        </div>
      ))}

      {/* Articles */}
      {(user.devtoUsername || user.mediumUsername || user.hashnodeUsername) && (
        <div className="col-span-2 md:col-span-4 lg:col-span-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
          <ArticlesSection user={user} theme={theme} />
        </div>
      )}
    </div>
  );
}
