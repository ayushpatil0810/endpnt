import { GithubCalendarSection } from './github-calendar-section';
import { GithubTopRepos } from '@/components/GithubTopRepos';
import { GithubLanguages } from '@/components/GithubLanguages';
import { GithubActivityFeed } from '@/components/GithubActivityFeed';
import { ThemedCard } from '../themed-card';
import type { ThemeDefinition } from '@/lib/themes';
import type { User } from '../types';

interface GithubSectionProps {
	user: User;
	theme: ThemeDefinition;
	/** Optional layout type to render different sub-arrangements if needed, or we just pass grid classes */
	layout?: 'bento' | 'minimal' | 'sidebar';
}

/**
 * Groups all GitHub related components into a single cohesive section.
 */
export function GithubSection({ user, theme, layout = 'sidebar' }: GithubSectionProps) {
	if (!user.githubUsername) return null;

	const isMinimal = layout === 'minimal';
	const isBento = layout === 'bento';

	// Bento layout spreads out differently, it doesn't wrap in a single card
	// Wait, the prompt says "group the github relate stuff to together"
	// So for Bento, we could wrap them all in one large thematic container, or just group them visually.
	// Actually, having a single ThemedCard wrapper around them looks much cleaner and premium.

	return (
		<div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
			<h2
				className="text-[10px] font-mono tracking-widest uppercase pb-3"
				style={{
					color: 'var(--theme-text-secondary)',
					borderBottom: '1px solid var(--theme-separator)',
				}}
			>
				GitHub Activity
			</h2>

			<div
				className={`grid gap-4 sm:gap-6 ${isBento ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
			>
				<div className={isBento ? 'md:col-span-2' : ''}>
					<GithubCalendarSection user={user} theme={theme} />
				</div>

				<div className={isBento ? 'md:col-span-1' : ''}>
					<GithubTopRepos username={user.githubUsername} theme={theme} />
				</div>

				<div className={`grid gap-4 sm:gap-6 ${isBento ? 'md:col-span-1' : 'md:grid-cols-2'}`}>
					<GithubLanguages username={user.githubUsername} theme={theme} />
					<GithubActivityFeed username={user.githubUsername} theme={theme} />
				</div>
			</div>
		</div>
	);
}
