import type { Project } from '@/db/schema/schema';
import { IconExternalLink, IconBrandGithub, IconCode } from '@tabler/icons-react';

interface FeaturedProjectsProps {
	projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
	if (!projects || projects.length === 0) return null;

	return (
		<section className="flex flex-col gap-4 w-full mb-8">
			<h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2">
				Featured Projects
			</h2>

			<div className="grid grid-cols-1 gap-3">
				{projects.map((project) => (
					<div
						key={project.id}
						className="group flex flex-col gap-3 p-5 sm:p-6 rounded-none bg-card/5 hover:bg-card/15 border border-border/40 hover:border-foreground/25 transition-all duration-300 backdrop-blur-md"
					>
						{/* Title row */}
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3 min-w-0">
								<div className="shrink-0 flex items-center justify-center size-8 rounded-none bg-foreground/6 border border-border/30 group-hover:border-foreground/20 transition-colors">
									<IconCode
										size={15}
										className="text-foreground/70 group-hover:text-foreground transition-colors"
									/>
								</div>
								<h3 className="text-sm font-semibold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors normal-case leading-snug">
									{project.title}
								</h3>
							</div>

							{/* CTA buttons */}
							<div className="flex items-center gap-2 shrink-0">
								{project.liveUrl && (
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-none border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all"
									>
										<IconExternalLink size={11} />
										Live
									</a>
								)}
								{project.githubUrl && (
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-none border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all"
									>
										<IconBrandGithub size={11} />
										GitHub
									</a>
								)}
							</div>
						</div>

						{/* Description */}
						{project.description && (
							<p className="text-xs text-muted-foreground/75 leading-relaxed normal-case pl-11">
								{project.description}
							</p>
						)}

						{/* Tech stack chips */}
						{project.techStack && project.techStack.length > 0 && (
							<div className="flex flex-wrap gap-1.5 pl-11">
								{project.techStack.map((tech) => (
									<span
										key={tech}
										className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-border/40 bg-foreground/[0.04] text-muted-foreground/70 uppercase tracking-wider"
									>
										{tech}
									</span>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
