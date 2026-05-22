import { IconCode, IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { ThemedCard } from './themed-card';
import type { ThemeDefinition } from '@/lib/themes';
import type { Project } from './types';

interface ProjectCardProps {
	project: Project;
	theme: ThemeDefinition;
}

/**
 * A single project card for the public profile.
 *
 * All theme-specific values come from CSS variables — no `theme.id` branching.
 * Tech stack tags use `--theme-tag-radius` for per-theme shape (pill vs. square).
 */
export function ProjectCard({ project, theme }: ProjectCardProps) {
	return (
		<ThemedCard
			theme={theme}
			className="group flex flex-col justify-between p-6 min-h-[200px] h-full"
		>
			<div className="flex flex-col gap-4">
				{/* Header row: icon + title + link buttons */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div
							className="size-10 rounded-full flex items-center justify-center transition-colors shrink-0"
							style={{
								background: 'var(--theme-tag-bg)',
								border: '1px solid var(--theme-separator)',
							}}
						>
							<IconCode size={18} style={{ color: 'var(--theme-tag-text)' }} />
						</div>
						<h3
							className="text-lg font-semibold tracking-tight"
							style={{ color: 'var(--theme-text-primary)' }}
						>
							{project.title}
						</h3>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						{project.githubUrl && (
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${project.title} on GitHub`}
								className="size-8 flex items-center justify-center rounded-full transition-colors"
								style={{
									background: 'var(--theme-tag-bg)',
									border: '1px solid var(--theme-separator)',
									color: 'var(--theme-text-secondary)',
								}}
							>
								<IconBrandGithub size={14} />
							</a>
						)}
						{project.liveUrl && (
							<a
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${project.title} live demo`}
								className="size-8 flex items-center justify-center rounded-full transition-colors"
								style={{
									background: 'var(--theme-tag-bg)',
									border: '1px solid var(--theme-separator)',
									color: 'var(--theme-text-secondary)',
								}}
							>
								<IconExternalLink size={14} />
							</a>
						)}
					</div>
				</div>

				{project.description && (
					<p
						className="text-sm leading-relaxed mt-2 line-clamp-3"
						style={{ color: 'var(--theme-text-secondary)' }}
					>
						{project.description}
					</p>
				)}
			</div>

			{/* Tech stack — shape controlled by --theme-tag-radius CSS variable */}
			{project.techStack && project.techStack.length > 0 && (
				<div
					className="flex flex-wrap gap-1.5 mt-6 pt-4"
					style={{ borderTop: '1px solid var(--theme-separator)' }}
				>
					{project.techStack.map((tech) => (
						<span
							key={tech}
							className="text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider"
							style={{
								background: 'var(--theme-tag-bg)',
								border: `1px solid var(--theme-tag-border, var(--theme-separator))`,
								color: 'var(--theme-tag-text)',
								borderRadius: 'var(--theme-tag-radius)',
							}}
						>
							{tech}
						</span>
					))}
				</div>
			)}
		</ThemedCard>
	);
}
