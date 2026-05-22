'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	IconGripVertical,
	IconCheck,
	IconX,
	IconLoader2,
	IconExternalLink,
	IconBrandGithub,
	IconCode,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import type { Project } from '@/db/schema/schema';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
	project: Project;
	onUpdate: (updated: Project) => void;
	onDelete: (id: string) => void;
}

const INPUT_CLASS =
	'w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-none px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case';

export function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
	const [editing, setEditing] = useState(false);
	const [title, setTitle] = useState(project.title);
	const [description, setDescription] = useState(project.description ?? '');
	const [liveUrl, setLiveUrl] = useState(project.liveUrl ?? '');
	const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? '');
	const [techInput, setTechInput] = useState((project.techStack ?? []).join(', '));
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: project.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
		zIndex: isDragging ? 50 : undefined,
	};

	async function save() {
		if (!title.trim()) return;
		setSaving(true);
		const techStack = techInput
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		try {
			const optimistic: Project = {
				...project,
				title: title.trim(),
				description: description.trim() || null,
				liveUrl: liveUrl.trim() || null,
				githubUrl: githubUrl.trim() || null,
				techStack,
			};
			onUpdate(optimistic);
			setEditing(false);

			const res = await fetch(`/api/projects/${project.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim() || null,
					liveUrl: liveUrl.trim() || null,
					githubUrl: githubUrl.trim() || null,
					techStack,
				}),
			});

			if (!res.ok) throw new Error('Failed');
			const updated: Project = await res.json();
			onUpdate(updated);
			toast.success('Project updated!');
		} catch {
			onUpdate(project);
			setEditing(true);
			toast.error('Failed to update project.');
		} finally {
			setSaving(false);
		}
	}

	function cancelEdit() {
		setTitle(project.title);
		setDescription(project.description ?? '');
		setLiveUrl(project.liveUrl ?? '');
		setGithubUrl(project.githubUrl ?? '');
		setTechInput((project.techStack ?? []).join(', '));
		setEditing(false);
	}

	async function handleDelete() {
		setDeleting(true);
		onDelete(project.id);
		try {
			const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed');
			toast.success('Project deleted.');
		} catch {
			toast.error('Failed to delete project. Please refresh.');
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'group flex flex-col sm:flex-row sm:items-start gap-6 py-6 border-b border-border/50 transition-all duration-300',
				isDragging && 'scale-[1.02] border-foreground shadow-2xl bg-card'
			)}
		>
			<div className="flex items-start gap-6 w-full">
				{/* Drag handle */}
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-50 hover:opacity-100 transition-all touch-none py-2 rounded-none mt-1"
					aria-label="Reorder"
				>
					<IconGripVertical size={20} stroke={1.5} />
				</button>

				{/* Content */}
				<div className="flex-1 w-full min-w-0 pr-4">
					{editing ? (
						<div className="flex flex-col gap-3 w-full">
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Project title"
								className={cn(INPUT_CLASS, 'text-base font-medium tracking-tight')}
								autoFocus
							/>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Short description (optional)"
								rows={2}
								className={cn(INPUT_CLASS, 'resize-none')}
							/>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<input
									type="text"
									value={liveUrl}
									onChange={(e) => setLiveUrl(e.target.value)}
									placeholder="Live URL (optional)"
									className={INPUT_CLASS}
								/>
								<input
									type="text"
									value={githubUrl}
									onChange={(e) => setGithubUrl(e.target.value)}
									placeholder="GitHub URL (optional)"
									className={INPUT_CLASS}
								/>
							</div>
							<input
								type="text"
								value={techInput}
								onChange={(e) => setTechInput(e.target.value)}
								placeholder="Tech stack, comma-separated (e.g. React, Go, Postgres)"
								className={INPUT_CLASS}
							/>
							<div className="flex items-center gap-4 mt-2">
								<button
									onClick={save}
									disabled={saving}
									className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-none text-[10px] uppercase tracking-widest font-medium disabled:opacity-50 transition-colors"
								>
									{saving ? (
										<IconLoader2 size={12} className="animate-spin" />
									) : (
										<IconCheck size={12} />
									)}
									Save
								</button>
								<button
									onClick={cancelEdit}
									className="flex items-center gap-2 px-6 py-2.5 rounded-none text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-card transition-colors border border-transparent hover:border-border"
								>
									<IconX size={12} /> Cancel
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-2 w-full">
							<div className="flex items-center gap-3">
								<IconCode size={16} className="text-foreground shrink-0" />
								<span className="font-medium text-base tracking-tight text-foreground normal-case">
									{project.title}
								</span>
							</div>

							{project.description && (
								<p className="text-xs text-muted-foreground/80 normal-case leading-relaxed pl-7">
									{project.description}
								</p>
							)}

							{/* Tech chips */}
							{project.techStack && project.techStack.length > 0 && (
								<div className="flex flex-wrap gap-1.5 pl-7 mt-1">
									{project.techStack.map((tech) => (
										<span
											key={tech}
											className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground/70 bg-muted/30 uppercase tracking-wider"
										>
											{tech}
										</span>
									))}
								</div>
							)}

							{/* Links */}
							<div className="flex items-center gap-4 pl-7 mt-1">
								{project.liveUrl && (
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors normal-case"
									>
										<IconExternalLink size={11} /> Live
									</a>
								)}
								{project.githubUrl && (
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors normal-case"
									>
										<IconBrandGithub size={11} /> GitHub
									</a>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				{!editing && (
					<div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity duration-300 ml-auto mr-0 sm:mr-4 flex-col sm:flex-row">
						<button
							onClick={() => setEditing(true)}
							className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-none px-3 py-1.5 hover:bg-muted"
						>
							Edit
						</button>
						<button
							onClick={handleDelete}
							disabled={deleting}
							className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground hover:text-destructive transition-colors border border-border rounded-none px-3 py-1.5 hover:bg-destructive/10 disabled:opacity-50"
						>
							{deleting ? <IconLoader2 size={12} className="animate-spin" /> : 'Delete'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
