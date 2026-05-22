import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DevtoPostsSkeleton, BlogPostsSkeleton } from '@/components/profile-skeletons';
import { ThemedCard } from '../themed-card';

const DevtoPosts = dynamic(() => import('@/components/DevToPosts').then((mod) => mod.DevtoPosts), {
	loading: () => <DevtoPostsSkeleton />,
});

const BlogPosts = dynamic(() => import('@/components/BlogPosts').then((mod) => mod.BlogPosts), {
	loading: () => <BlogPostsSkeleton />,
});
import type { ThemeDefinition } from '@/lib/themes';
import type { User } from '../types';

interface ArticlesSectionProps {
	user: User;
	theme: ThemeDefinition;
}

/**
 * Articles section. Shows Dev.to and/or Medium/Hashnode posts.
 * Returns null when the user hasn't connected any writing platform.
 * Each platform is independently suspended so a slow API doesn't block others.
 */
export function ArticlesSection({ user, theme }: ArticlesSectionProps) {
	const hasDevto = Boolean(user.devtoUsername);
	const hasBlog = Boolean(user.mediumUsername || user.hashnodeUsername);

	if (!hasDevto && !hasBlog) return null;

	return (
		<div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
			<ThemedCard theme={theme} className="flex flex-col gap-4 p-6 sm:p-8">
				<h2
					className="text-[10px] font-mono tracking-widest uppercase pb-3"
					style={{
						color: 'var(--theme-text-secondary)',
						borderBottom: '1px solid var(--theme-separator)',
					}}
				>
					Latest Articles
				</h2>
				<div className="flex flex-col gap-6">
					{hasDevto && (
						<ErrorBoundary fallbackMessage="Failed to load Dev.to posts">
							<Suspense fallback={<DevtoPostsSkeleton />}>
								<DevtoPosts username={user.devtoUsername ?? ''} />
							</Suspense>
						</ErrorBoundary>
					)}
					{hasBlog && (
						<ErrorBoundary fallbackMessage="Failed to load blog posts">
							<Suspense fallback={<BlogPostsSkeleton />}>
								<BlogPosts
									mediumUsername={user.mediumUsername ?? undefined}
									hashnodeUsername={user.hashnodeUsername ?? undefined}
								/>
							</Suspense>
						</ErrorBoundary>
					)}
				</div>
			</ThemedCard>
		</div>
	);
}
