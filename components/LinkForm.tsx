'use client';

import { useState } from 'react';
import { IconLoader2, IconX, IconPlus, IconLink } from '@tabler/icons-react';
import { toast } from 'sonner';
import type { Link as DbLink } from '@/db/schema/schema';
import { motion, AnimatePresence } from 'motion/react';
import { LinkIcon } from './LinkIcon';

interface LinkFormProps {
	onLinkAdded: (link: DbLink) => void;
}

const PRESETS = [
	{ title: 'Instagram', url: 'https://instagram.com/' },
	{ title: 'X', url: 'https://x.com/' },
	{ title: 'YouTube', url: 'https://youtube.com/' },
	{ title: 'Facebook', url: 'https://facebook.com/' },
	{ title: 'LinkedIn', url: 'https://linkedin.com/in/' },
	{ title: 'GitHub', url: 'https://github.com/' },
	{ title: 'Telegram', url: 'https://t.me/' },
	{ title: 'WhatsApp', url: 'https://wa.me/' },
	{ title: 'Email', url: 'mailto:' },
];

const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
const EMAIL_REGEX = /^mailto:.+@.+\..+/i;
const PHONE_REGEX = /^tel:[\d\+\-\(\)\s]+$/;

export function isValidUrlString(val: string) {
	if (!val.trim()) return true;
	if (val.startsWith('mailto:')) return EMAIL_REGEX.test(val);
	if (val.startsWith('tel:')) return PHONE_REGEX.test(val);
	return URL_REGEX.test(val);
}

export function LinkForm({ onLinkAdded }: LinkFormProps) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<'presets' | 'form'>('presets');
	const [title, setTitle] = useState('');
	const [url, setUrl] = useState('');
	const [loading, setLoading] = useState(false);

	const isUrlValid = isValidUrlString(url);

	function reset() {
		setTitle('');
		setUrl('');
		setOpen(false);
		setStep('presets');
	}

	function handlePresetClick(preset?: { title: string; url: string }) {
		if (preset) {
			setTitle(preset.title);
			setUrl(preset.url);
		} else {
			setTitle('');
			setUrl('');
		}
		setStep('form');
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!title.trim() || !url.trim() || !isUrlValid) return;

		// Auto-prepend https if missing (unless it's mailto: or similar)
		const normalizedUrl =
			url.startsWith('http://') ||
			url.startsWith('https://') ||
			url.startsWith('mailto:') ||
			url.startsWith('tel:')
				? url
				: `https://${url}`;

		setLoading(true);
		try {
			const res = await fetch('/api/links', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: title.trim(), url: normalizedUrl }),
			});

			if (!res.ok) {
				const data = await res.json();
				toast.error(data.error ?? 'Operation failed');
				return;
			}

			const newLink: DbLink = await res.json();
			onLinkAdded(newLink);
			toast.success('Link added!');
			reset();
		} catch {
			toast.error('Network failure.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full">
			{!open ? (
				<button
					id="add-new-link-btn"
					onClick={() => setOpen(true)}
					className="w-full flex items-center justify-between px-6 py-6 border-y border-border/40 hover:border-foreground group transition-colors duration-300 bg-card/5 hover:bg-card/20"
				>
					<div className="flex items-center gap-3">
						<IconPlus
							size={18}
							className="text-muted-foreground group-hover:text-foreground transition-colors"
						/>
						<span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
							Add new link
						</span>
					</div>
					<kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border border-border/50">
						<span className="text-xs">⌘</span> K
					</kbd>
				</button>
			) : (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="border border-border/80 p-4 sm:p-10 bg-card/10 relative mt-4 shadow-xl"
				>
					<div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
						<h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
							{step === 'presets' ? 'Select Link Type' : 'Link Details'}
						</h3>
						<button
							onClick={reset}
							className="text-muted-foreground hover:text-foreground transition-colors bg-background p-2 rounded-full hover:bg-muted"
						>
							<IconX size={14} stroke={2} />
						</button>
					</div>

					<AnimatePresence mode="wait">
						{step === 'presets' ? (
							<motion.div
								key="presets"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="flex flex-col gap-6"
							>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{PRESETS.map((preset) => (
										<button
											key={preset.title}
											onClick={() => handlePresetClick(preset)}
											className="flex items-center gap-3 p-4 border border-border/50 hover:border-foreground hover:bg-foreground hover:text-background transition-all rounded-none group text-left"
										>
											<LinkIcon
												title={preset.title}
												url={preset.url}
												className="text-muted-foreground group-hover:text-background transition-colors"
											/>
											<span className="text-xs font-semibold tracking-wide uppercase text-foreground group-hover:text-background transition-colors">
												{preset.title}
											</span>
										</button>
									))}
								</div>

								<div className="w-full flex items-center gap-4">
									<div className="h-px bg-border/40 flex-1" />
									<span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
										OR
									</span>
									<div className="h-px bg-border/40 flex-1" />
								</div>

								<button
									onClick={() => handlePresetClick()}
									className="flex items-center justify-center gap-3 p-4 border border-border/50 hover:border-foreground bg-card/5 hover:bg-card/20 transition-all rounded-none text-center w-full"
								>
									<IconLink size={18} className="text-muted-foreground" />
									<span className="text-xs font-semibold tracking-wide uppercase text-foreground">
										Custom Link
									</span>
								</button>
							</motion.div>
						) : (
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
										id="link-title"
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Title"
										className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-none px-4 py-4 text-xl sm:text-2xl font-medium tracking-tight text-foreground focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/30 normal-case"
										autoFocus
										required
									/>
								</div>

								<div className="flex flex-col gap-2 relative group">
									<input
										id="link-url"
										type="text"
										value={url}
										onChange={(e) => setUrl(e.target.value)}
										placeholder="https://"
										className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-none px-4 py-4 text-sm sm:text-base font-mono tracking-wide text-foreground focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/30 normal-case"
										required
									/>
									{url === 'mailto:' && (
										<span className="text-[10px] text-muted-foreground absolute -bottom-5 left-0">
											Enter your email address after the colon.
										</span>
									)}
									{!isUrlValid && url.trim().length > 0 && url !== 'mailto:' && url !== 'tel:' && (
										<span className="text-[10px] text-destructive absolute -bottom-5 left-0">
											Please enter a valid URL.
										</span>
									)}
								</div>

								<div className="flex flex-col sm:flex-row gap-4 mt-8">
									<button
										type="submit"
										disabled={loading || !title.trim() || !url.trim() || !isUrlValid}
										className="bg-foreground text-background px-8 py-4 rounded-none text-[10px] sm:text-xs uppercase tracking-widest font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
									>
										{loading ? <IconLoader2 size={16} className="animate-spin" /> : null}
										{loading ? 'Adding...' : 'Add link'}
									</button>
									<button
										type="button"
										onClick={() => setStep('presets')}
										className="px-8 py-4 rounded-none text-[10px] sm:text-xs uppercase tracking-widest text-foreground hover:bg-muted transition-colors border border-border w-full sm:w-auto"
									>
										Back to Options
									</button>
								</div>
							</motion.form>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</div>
	);
}
