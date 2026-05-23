import { HeroCard } from '../hero-card';
import { PublicLinkButton } from '@/app/[username]/public-link-button';
import { DeveloperStatsSection } from '../sections/developer-stats-section';
import { ProjectsSection } from '../sections/projects-section';
import { ArticlesSection } from '../sections/articles-section';
import { GithubSection } from '../sections/github-section';
import type { ProfileLayoutProps } from '../types';

/**
 * Minimal Layout — single-column, centered, constrained width.
 * Ideal for link-heavy profiles that want a clean, Linktree-style feel.
 */
export function MinimalLayout({ user, userLinks, userProjects, theme }: ProfileLayoutProps) {
	return (
		<div className="max-w-[680px] w-full mx-auto flex flex-col gap-10 sm:gap-14 relative z-10">
			<HeroCard user={user} theme={theme} alignCenter />

			{userLinks.length > 0 && (
				<div className="flex flex-col gap-4">
					<h2
						className="text-[10px] font-mono tracking-widest uppercase pb-3"
						style={{
							color: 'var(--theme-text-secondary)',
							borderBottom: '1px solid var(--theme-separator)',
						}}
					>
						Links
					</h2>
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
				</div>
			)}

			<DeveloperStatsSection user={user} theme={theme} />

			<GithubSection user={user} theme={theme} layout="minimal" />

			<ProjectsSection projects={userProjects} theme={theme} gridClass="flex flex-col gap-4" />

			<ArticlesSection user={user} theme={theme} />
		</div>
	);
}
