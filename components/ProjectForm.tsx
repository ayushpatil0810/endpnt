'use client';

import { useState } from 'react';
import { IconLoader2, IconPlus, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import type { Project } from '@/db/schema/schema';
import { isValidUrlString } from './LinkForm';

interface ProjectFormProps {
	onProjectAdded: (project: Project) => void;
}

const INPUT_CLASS =
	'w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-none px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case';

export function ProjectForm({ onProjectAdded }: ProjectFormProps) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [liveUrl, setLiveUrl] = useState('');
	const [githubUrl, setGithubUrl] = useState('');
	const [techInput, setTechInput] = useState('');
	const [saving, setSaving] = useState(false);

	function reset() {
		setTitle('');
		setDescription('');
		setLiveUrl('');
		setGithubUrl('');
		setTechInput('');
		setOpen(false);
	}

	const isLiveUrlValid = isValidUrlString(liveUrl);
	const isGithubUrlValid = isValidUrlString(githubUrl);
	const isFormValid = !!title.trim() && isLiveUrlValid && isGithubUrlValid;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isFormValid) return;
		setSaving(true);

		const techStack = techInput
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		try {
			const res = await fetch('/api/projects', {
				method: 'POST',
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
			const newProject: Project = await res.json();
			onProjectAdded(newProject);
			toast.success('Project added!');
			reset();
		} catch {
			toast.error('Failed to add project.');
		} finally {
			setSaving(false);
		}
	}

	if (!open) {
		return (
			<button
				id="add-new-project-btn"
				onClick={() => setOpen(true)}
				className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-border/50 hover:border-foreground/40 rounded-none text-[10px] uppercase tracking-widest font-medium text-muted-foreground hover:text-foreground transition-all"
			>
				<IconPlus size={14} />
				Add Project
			</button>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-3 p-5 border border-border/50 rounded-none bg-card/10 backdrop-blur-sm"
		>
			<div className="flex items-center justify-between mb-1">
				<span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
					New Project
				</span>
				<button
					type="button"
					onClick={reset}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					<IconX size={14} />
				</button>
			</div>

			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Project title *"
				className={INPUT_CLASS}
				autoFocus
				required
			/>

			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Short description (optional)"
				rows={2}
				className={`${INPUT_CLASS} resize-none`}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div className="flex flex-col gap-1 w-full relative">
					<input
						type="text"
						value={liveUrl}
						onChange={(e) => setLiveUrl(e.target.value)}
						placeholder="Live URL (optional)"
						className={INPUT_CLASS}
					/>
					{!isLiveUrlValid && liveUrl.trim().length > 0 && (
						<span className="text-[10px] text-destructive px-1 absolute -bottom-4">
							Invalid URL
						</span>
					)}
				</div>
				<div className="flex flex-col gap-1 w-full relative">
					<input
						type="text"
						value={githubUrl}
						onChange={(e) => setGithubUrl(e.target.value)}
						placeholder="GitHub URL (optional)"
						className={INPUT_CLASS}
					/>
					{!isGithubUrlValid && githubUrl.trim().length > 0 && (
						<span className="text-[10px] text-destructive px-1 absolute -bottom-4">
							Invalid URL
						</span>
					)}
				</div>
			</div>

			<input
				type="text"
				value={techInput}
				onChange={(e) => setTechInput(e.target.value)}
				placeholder="Tech stack, comma-separated (e.g. React, Go, Postgres)"
				className={INPUT_CLASS}
			/>

			<div className="flex items-center gap-4 mt-3">
				<button
					type="submit"
					disabled={saving || !isFormValid}
					className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-none text-[10px] uppercase tracking-widest font-medium disabled:opacity-50 transition-colors"
				>
					{saving ? <IconLoader2 size={12} className="animate-spin" /> : <IconPlus size={12} />}
					Add Project
				</button>
				<button
					type="button"
					onClick={reset}
					className="flex items-center gap-2 px-6 py-2.5 rounded-none text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-card transition-colors border border-transparent hover:border-border"
				>
					<IconX size={12} /> Cancel
				</button>
			</div>
		</form>
	);
}
