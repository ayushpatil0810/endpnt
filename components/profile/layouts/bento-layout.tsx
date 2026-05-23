import { HeroCard } from '../hero-card';
import { ProjectCard } from '../project-card';
import { PublicLinkButton } from '@/app/[username]/public-link-button';
import { DeveloperStatsSection } from '../sections/developer-stats-section';
import { ArticlesSection } from '../sections/articles-section';
import { GithubSection } from '../sections/github-section';
import type { ProfileLayoutProps } from '../types';

/**
 * Bento Layout — dense, magazine-style grid.
 */
export function BentoLayout({ user, userLinks, userProjects, theme }: ProfileLayoutProps) {
	return (
		<div className="max-w-[1200px] w-full mx-auto flex flex-col gap-10 sm:gap-14 relative z-10">
			{/* Top Bento Grid: Hero, Dev Stats, Links */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-max grid-flow-row-dense">
				{/* Hero — anchors top-left, spans 2 cols × 2 rows on lg */}
				<div className="col-span-2 md:col-span-4 lg:col-span-2 lg:row-span-2">
					<HeroCard user={user} theme={theme} />
				</div>

				{/* Dev stats span 2 cols to fit nicely in the bento flow */}
				{(user.githubUsername || user.leetcodeUsername) && (
					<div className="col-span-2 md:col-span-2 lg:col-span-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
						<DeveloperStatsSection user={user} theme={theme} />
					</div>
				)}

				{/* Link buttons act as distinct bento tiles */}
				{userLinks.map((link, idx) => (
					<div
						key={link.id}
						className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
						style={{ animationDelay: `${(idx + 1) * 100}ms` }}
					>
						<PublicLinkButton link={link} themeId={theme.id} />
					</div>
				))}
			</div>

			{/* GitHub Section */}
			<GithubSection user={user} theme={theme} layout="bento" />

			{/* Projects */}
			{userProjects.length > 0 && (
				<div className="w-full flex flex-col gap-4">
					<h2
						className="text-[10px] font-mono tracking-widest uppercase pb-3"
						style={{
							color: 'var(--theme-text-secondary)',
							borderBottom: '1px solid var(--theme-separator)',
						}}
					>
						Projects
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{userProjects.map((project, idx) => (
							<div
								key={project.id}
								className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
								style={{ animationDelay: `${(idx + 5) * 100}ms` }}
							>
								<ProjectCard project={project} theme={theme} />
							</div>
						))}
					</div>
				</div>
			)}

			{/* Articles */}
			<ArticlesSection user={user} theme={theme} />
		</div>
	);
}
