import { IconStar, IconGitFork } from '@tabler/icons-react';
import { getGithubProfile } from '@/lib/github';
import { ThemedCard } from '@/components/profile/themed-card';
import type { ThemeDefinition } from '@/lib/themes';

export async function GithubTopRepos({
	username,
	theme,
}: {
	username: string;
	theme: ThemeDefinition;
}) {
	const profile = await getGithubProfile(username);
	if (!profile || !profile.pinnedRepos?.length) return null;

	return (
		<ThemedCard theme={theme} className="w-full p-5 sm:p-6 flex flex-col h-full">
			<h2
				className="text-[10px] font-mono tracking-widest uppercase border-b pb-2 mb-4"
				style={{ color: 'var(--theme-text-secondary)', borderColor: 'var(--theme-separator)' }}
			>
				Pinned & Top OSS
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
				{profile.pinnedRepos.map((repo) => (
					<a
						key={repo.name}
						href={repo.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col p-4 border rounded-md hover:opacity-80 transition-opacity gap-2 group"
						style={{ borderColor: 'var(--theme-separator)' }}
					>
						<span
							className="font-semibold text-sm tracking-tight truncate group-hover:underline"
							style={{ color: 'var(--theme-text-primary)' }}
						>
							{repo.name}
						</span>
						<p
							className="text-xs line-clamp-2 min-h-[32px]"
							style={{ color: 'var(--theme-text-secondary)' }}
						>
							{repo.description || 'No description provided.'}
						</p>
						<div
							className="flex items-center gap-3 text-[10px] mt-auto pt-2 font-mono"
							style={{ color: 'var(--theme-text-secondary)' }}
						>
							{repo.primaryLanguage && (
								<div className="flex items-center gap-1.5">
									<span
										className="w-2.5 h-2.5 rounded-full"
										style={{ backgroundColor: repo.primaryLanguage.color }}
									/>
									<span>{repo.primaryLanguage.name}</span>
								</div>
							)}
							<div className="flex items-center gap-1">
								<IconStar size={12} />
								<span>{repo.stargazerCount}</span>
							</div>
							<div className="flex items-center gap-1">
								<IconGitFork size={12} />
								<span>{repo.forkCount}</span>
							</div>
						</div>
					</a>
				))}
			</div>
		</ThemedCard>
	);
}
