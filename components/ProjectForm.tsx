'use client';

import { useState } from 'react';
import { IconLoader2, IconPlus, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import type { Project } from '@/db/schema/schema';
import { isValidUrlString } from './LinkForm';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectFormProps {
	onProjectAdded: (project: Project) => void;
}

const TITLE_CLASS =
	'w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-none px-4 py-4 text-xl sm:text-2xl font-medium tracking-tight text-foreground focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/30 normal-case';

const INPUT_CLASS =
	'w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-none px-4 py-4 text-sm sm:text-base font-mono tracking-wide text-foreground focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/30 normal-case';

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

	return (
		<div className="w-full">
			{!open ? (
				<button
					id="add-new-project-btn"
					onClick={() => setOpen(true)}
					className="w-full flex items-center justify-between px-6 py-6 border-y border-border/40 hover:border-foreground group transition-colors duration-300 bg-card/5 hover:bg-card/20"
				>
					<div className="flex items-center gap-3">
						<IconPlus
							size={18}
							className="text-muted-foreground group-hover:text-foreground transition-colors"
						/>
						<span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
							Add new project
						</span>
					</div>
				</button>
			) : (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="border border-border/80 p-4 sm:p-10 bg-card/10 relative mt-4 shadow-xl"
				>
					<div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
						<h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
							Project Details
						</h3>
						<button
							onClick={reset}
							className="text-muted-foreground hover:text-foreground transition-colors bg-background p-2 rounded-full hover:bg-muted"
						>
							<IconX size={14} stroke={2} />
						</button>
					</div>

					<AnimatePresence mode="wait">
						<motion.form
							key="form"
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 10 }}
							onSubmit={handleSubmit}
							className="flex flex-col gap-8"
						>
							<div className="flex flex-col gap-2 relative group">
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Project title *"
									className={TITLE_CLASS}
									autoFocus
									required
								/>
							</div>

							<div className="flex flex-col gap-2 relative group">
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Short description (optional)"
									rows={2}
									className={`${INPUT_CLASS} resize-none`}
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-4">
								<div className="flex flex-col gap-2 relative group">
									<input
										type="text"
										value={liveUrl}
										onChange={(e) => setLiveUrl(e.target.value)}
										placeholder="Live URL (optional)"
										className={INPUT_CLASS}
									/>
									{!isLiveUrlValid && liveUrl.trim().length > 0 && (
										<span className="text-[10px] text-destructive px-1 absolute -bottom-5">
											Invalid URL
										</span>
									)}
								</div>
								<div className="flex flex-col gap-2 relative group">
									<input
										type="text"
										value={githubUrl}
										onChange={(e) => setGithubUrl(e.target.value)}
										placeholder="GitHub URL (optional)"
										className={INPUT_CLASS}
									/>
									{!isGithubUrlValid && githubUrl.trim().length > 0 && (
										<span className="text-[10px] text-destructive px-1 absolute -bottom-5">
											Invalid URL
										</span>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-2 relative group">
								<input
									type="text"
									value={techInput}
									onChange={(e) => setTechInput(e.target.value)}
									placeholder="Tech stack, comma-separated (e.g. React, Go, Postgres)"
									className={INPUT_CLASS}
								/>
							</div>

							<div className="flex flex-col sm:flex-row gap-4 mt-2">
								<button
									type="submit"
									disabled={saving || !isFormValid}
									className="bg-foreground text-background px-8 py-4 rounded-none text-[10px] sm:text-xs uppercase tracking-widest font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
								>
									{saving ? <IconLoader2 size={16} className="animate-spin" /> : null}
									{saving ? 'Adding...' : 'Add project'}
								</button>
								<button
									type="button"
									onClick={reset}
									className="px-8 py-4 rounded-none text-[10px] sm:text-xs uppercase tracking-widest text-foreground hover:bg-muted transition-colors border border-border w-full sm:w-auto"
								>
									Cancel
								</button>
							</div>
						</motion.form>
					</AnimatePresence>
				</motion.div>
			)}
		</div>
	);
}
