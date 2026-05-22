import { ProjectCard } from '../project-card';
import type { ThemeDefinition } from '@/lib/themes';
import type { Project } from '../types';

interface ProjectsSectionProps {
	projects: Project[];
	theme: ThemeDefinition;
	/** Tailwind class string for the projects grid. Layouts pass their own. */
	gridClass: string;
}

/**
 * Projects section with a labeled header.
 * Returns null when there are no projects to display, preventing
 * empty section headers from appearing on sparse profiles.
 */
export function ProjectsSection({ projects, theme, gridClass }: ProjectsSectionProps) {
	if (projects.length === 0) return null;

	return (
		<div className="flex flex-col gap-4 w-full">
			<h2
				className="text-[10px] font-mono tracking-widest uppercase pb-3"
				style={{
					color: 'var(--theme-text-secondary)',
					borderBottom: '1px solid var(--theme-separator)',
				}}
			>
				Projects
			</h2>
			<div className={gridClass}>
				{projects.map((project, idx) => (
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
	);
}
