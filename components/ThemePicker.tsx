'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';
import { THEMES, type ThemeId } from '@/lib/themes';
import { cn } from '@/lib/utils';

interface ThemePickerProps {
	currentTheme: ThemeId | string;
	onThemeChange: (theme: ThemeId) => void;
}

const THEME_PREVIEW_STYLES: Record<string, React.CSSProperties> = {
	glassmorphism: {
		background: '#000000',
	},
	'neo-brutalism': {
		background: '#f5f0e8',
	},
	neumorphism: {
		background: '#e0e5ec',
	},
	'retro-pop': {
		background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ede9fe 100%)',
	},
	claymorphism: {
		background: '#f0f4f8',
	},
	terminal: {
		background: '#000000',
	},
};

const THEME_CARD_PREVIEWS: Record<string, React.CSSProperties> = {
	glassmorphism: {
		background: 'rgba(255, 255, 255, 0.03)',
		border: '1px solid rgba(255, 255, 255, 0.08)',
		borderRadius: '20px',
		backdropFilter: 'blur(16px)',
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
	},
	'neo-brutalism': {
		background: '#ffffff',
		border: '2.5px solid #1a1a1a',
		borderRadius: '0px',
		boxShadow: '4px 4px 0px #1a1a1a',
	},
	neumorphism: {
		background: '#e0e5ec',
		border: 'none',
		borderRadius: '10px',
		boxShadow: '5px 5px 10px #b8bec7, -5px -5px 10px #ffffff',
	},
	'retro-pop': {
		background: '#ffffff',
		border: '2px solid rgba(255,255,255,0.9)',
		borderRadius: '14px',
		boxShadow: '0 5px 0px #d4b8e0, 0 8px 16px rgba(180,140,220,0.25)',
	},
	claymorphism: {
		background: '#ffffff',
		border: 'none',
		borderRadius: '18px',
		boxShadow:
			'8px 8px 16px rgba(0, 0, 0, 0.04), -8px -8px 16px rgba(255, 255, 255, 0.8), inset 4px 4px 8px rgba(255, 255, 255, 0.8)',
	},
	terminal: {
		background: '#050505',
		border: '1px solid #00ff00',
		borderRadius: '0px',
		boxShadow: '0 0 10px rgba(0, 255, 0, 0.15)',
	},
};

const THEME_TEXT_COLORS: Record<string, string> = {
	glassmorphism: 'rgba(255,255,255,0.9)',
	'neo-brutalism': '#1a1a1a',
	neumorphism: '#3a4a5e',
	'retro-pop': '#2d1b69',
	claymorphism: '#334155',
	terminal: '#00ff00',
};

const THEME_MUTED_COLORS: Record<string, string> = {
	glassmorphism: 'rgba(255,255,255,0.45)',
	'neo-brutalism': '#555555',
	neumorphism: '#7a8a9e',
	'retro-pop': '#7c5cbf',
	claymorphism: '#64748b',
	terminal: '#00aa00',
};

export function ThemePicker({ currentTheme, onThemeChange }: ThemePickerProps) {
	const [saving, setSaving] = useState(false);

	const handleUpdate = async (themeId: ThemeId) => {
		if (themeId === currentTheme) return;
		setSaving(true);
		onThemeChange(themeId); // optimistic

		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ theme: themeId }),
			});
			if (!res.ok) throw new Error('Sync failed');
			toast.success('Theme updated!');
		} catch {
			toast.error('Failed to update theme.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-between border-b border-border/40 pb-4">
				<div>
					<h2 className="text-sm font-semibold text-foreground">Profile Theme</h2>
					<p className="text-[11px] text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">
						Choose a style for your public profile page
					</p>
				</div>
				{saving && (
					<span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-muted-foreground animate-pulse">
						<IconLoader2 size={12} className="animate-spin" />
						Saving
					</span>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{THEMES.map((theme) => {
					const isActive = currentTheme === theme.id;
					const bgStyle = THEME_PREVIEW_STYLES[theme.id];
					const cardStyle = THEME_CARD_PREVIEWS[theme.id];
					const textColor = THEME_TEXT_COLORS[theme.id];
					const mutedColor = THEME_MUTED_COLORS[theme.id];

					return (
						<button
							key={theme.id}
							onClick={() => handleUpdate(theme.id as ThemeId)}
							className={cn(
								'group relative flex flex-col gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left',
								isActive
									? 'border-foreground bg-foreground/5 shadow-md'
									: 'border-border/50 hover:border-foreground/50 bg-card/10'
							)}
						>
							{/* Mini Preview */}
							<div
								className="w-full h-28 rounded-lg overflow-hidden flex items-center justify-center relative shadow-sm"
								style={bgStyle}
							>
								{/* Active badge */}
								{isActive && (
									<div className="absolute top-2 right-2 flex items-center gap-1 bg-foreground text-background rounded-full px-2 py-0.5 z-20 shadow-md">
										<IconCheck size={10} stroke={3} />
										<span className="text-[9px] font-bold uppercase tracking-wider">Active</span>
									</div>
								)}
								{/* Mini "card" inside preview */}
								<div className="w-3/4 px-3 py-2.5 flex flex-col gap-1.5" style={cardStyle}>
									{/* Avatar + name row */}
									<div className="flex items-center gap-2">
										<div
											className="size-5 rounded-full shrink-0"
											style={{
												background: theme.previewColors[2] ?? '#888',
												border: theme.id === 'neo-brutalism' ? '1.5px solid #1a1a1a' : 'none',
											}}
										/>
										<div className="flex flex-col gap-0.5">
											<div
												className="h-1.5 rounded-full w-14"
												style={{ background: textColor, opacity: 0.8 }}
											/>
											<div className="h-1 rounded-full w-10" style={{ background: mutedColor }} />
										</div>
									</div>
									{/* Content lines */}
									<div
										className="h-px w-full mt-0.5"
										style={{ background: mutedColor, opacity: 0.4 }}
									/>
									<div className="flex flex-col gap-1 mt-0.5">
										<div
											className="h-1 rounded-full w-full"
											style={{ background: mutedColor, opacity: 0.5 }}
										/>
										<div
											className="h-1 rounded-full w-3/4"
											style={{ background: mutedColor, opacity: 0.35 }}
										/>
									</div>
								</div>
							</div>

							{/* Theme info */}
							<div className="flex flex-col gap-1.5 z-10 w-full">
								<div className="flex items-center gap-2 w-full">
									<span className="text-sm font-semibold text-foreground">{theme.name}</span>
									{/* Color dots */}
									<div className="flex gap-1 ml-auto">
										{theme.previewColors.map((c, i) => (
											<div
												key={i}
												className="size-3 rounded-full border border-border/30"
												style={{ background: c }}
											/>
										))}
									</div>
								</div>
								<p className="text-[11px] text-muted-foreground leading-snug">
									{theme.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
