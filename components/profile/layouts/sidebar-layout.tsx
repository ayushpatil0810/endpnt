import { HeroCard } from '../hero-card';
import { PublicLinkButton } from '@/app/[username]/public-link-button';
import { DeveloperStatsSection } from '../sections/developer-stats-section';
import { ProjectsSection } from '../sections/projects-section';
import { ArticlesSection } from '../sections/articles-section';
import { GithubSection } from '../sections/github-section';
import type { ProfileLayoutProps } from '../types';

/**
 * Sidebar Layout — the default.
 *
 * Left column (4/12): sticky hero card.
 * Right column (8/12): links grid → dev stats → calendar → projects → articles.
 */
export function SidebarLayout({ user, userLinks, userProjects, theme }: ProfileLayoutProps) {
	return (
		<div className="max-w-[1100px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12 relative z-10">
			<aside className="lg:col-span-4 flex flex-col">
				<div className="lg:sticky lg:top-8 flex flex-col gap-6">
					<HeroCard user={user} theme={theme} />
					<DeveloperStatsSection user={user} theme={theme} stacked />
				</div>
			</aside>

			<main className="lg:col-span-8 flex flex-col gap-10 sm:gap-14">
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
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

				<GithubSection user={user} theme={theme} layout="sidebar" />

				<ProjectsSection
					projects={userProjects}
					theme={theme}
					gridClass="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
				/>

				<ArticlesSection user={user} theme={theme} />
			</main>
		</div>
	);
}
