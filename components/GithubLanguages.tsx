import { getGithubProfile } from '@/lib/github';
import { ThemedCard } from '@/components/profile/themed-card';
import type { ThemeDefinition } from '@/lib/themes';

export async function GithubLanguages({
	username,
	theme,
}: {
	username: string;
	theme: ThemeDefinition;
}) {
	const profile = await getGithubProfile(username);
	if (!profile || !profile.languages?.length) return null;

	return (
		<ThemedCard theme={theme} className="w-full p-5 sm:p-6 h-full flex flex-col gap-4">
			<h2
				className="text-[10px] font-mono tracking-widest uppercase border-b pb-2"
				style={{ color: 'var(--theme-text-secondary)', borderColor: 'var(--theme-separator)' }}
			>
				Languages
			</h2>
			<div
				className="flex w-full h-2 rounded-full overflow-hidden"
				style={{ backgroundColor: 'var(--theme-separator)' }}
			>
				{profile.languages.map((lang) => (
					<div
						key={lang.name}
						style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
						className="h-full"
						title={`${lang.name} ${lang.percentage.toFixed(1)}%`}
					/>
				))}
			</div>
			<div className="flex flex-wrap gap-x-4 gap-y-3">
				{profile.languages.map((lang) => (
					<div key={lang.name} className="flex items-center gap-1.5 text-xs">
						<span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
						<span className="font-medium" style={{ color: 'var(--theme-text-primary)' }}>
							{lang.name}
						</span>
						<span
							className="font-mono text-[10px]"
							style={{ color: 'var(--theme-text-secondary)' }}
						>
							{Math.round(lang.percentage)}%
						</span>
					</div>
				))}
			</div>
		</ThemedCard>
	);
}
