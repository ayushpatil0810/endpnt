import type { CSSProperties } from 'react';

export const THEME_IDS = [
	'glassmorphism',
	'neo-brutalism',
	'neumorphism',
	'retro-pop',
	'claymorphism',
	'terminal',
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeDefinition {
	id: ThemeId;
	name: string;
	description: string;
	/** Colors used to render the preview swatch in ThemePicker */
	previewColors: string[];
	/** Applied as inline style vars on the live page root element */
	cssVars: CSSProperties & Record<string, string>;
	/** Tailwind/inline classes for the page wrapper */
	pageClasses: string;
	/** Optional raw CSS block injected globally for this theme */
	customCss?: string;
}

export const THEMES: ThemeDefinition[] = [
	{
		id: 'glassmorphism',
		name: 'Glassmorphism',
		description: 'Frosted glass panels floating on a deep gradient cosmos',
		previewColors: ['#000000', '#111111', '#222222'],
		pageClasses: 'text-white',
		cssVars: {
			'--theme-bg': '#000000',
			'--theme-card-bg': 'rgba(255, 255, 255, 0.03)',
			'--theme-card-border': '1px solid rgba(255, 255, 255, 0.08)',
			'--theme-card-shadow':
				'0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
			'--theme-card-radius': '20px',
			'--theme-tag-radius': '10px',
			'--theme-card-backdrop': 'blur(16px)',
			'--theme-text-primary': '#ffffff',
			'--theme-text-secondary': 'rgba(255, 255, 255, 0.6)',
			'--theme-accent': 'rgba(160, 100, 255, 0.7)',
			'--theme-tag-bg': 'rgba(255, 255, 255, 0.07)',
			'--theme-tag-border': 'rgba(255, 255, 255, 0.12)',
			'--theme-tag-text': '#ffffff',
			'--theme-btn-bg': '#ffffff',
			'--theme-btn-text': '#0f0c29',
			'--theme-btn-radius': '0.5rem',
			'--theme-btn-border': 'none',
			'--theme-btn-shadow': 'none',
			'--theme-avatar-border': '2px solid rgba(255, 255, 255, 0.2)',
			'--theme-separator': 'rgba(255, 255, 255, 0.15)',
			'--theme-hover-lift': '-6px',
			'--theme-hover-shadow': '0 16px 48px rgba(0, 0, 0, 0.5)',
		},
		customCss: `
[data-theme="glassmorphism"] .theme-card {
  position: relative;
  overflow: hidden;
}
[data-theme="glassmorphism"] .theme-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  pointer-events: none;
}
[data-theme="glassmorphism"] .theme-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent, rgba(255, 255, 255, 0.05));
  pointer-events: none;
}
		`,
	},
	{
		id: 'neo-brutalism',
		name: 'Neo Brutalism',
		description: 'Raw, bold, unapologetically loud with borders and offset shadows',
		previewColors: ['#f5f3ea', '#11d7d1', '#10172b'],
		pageClasses: 'text-[#10172b]',
		cssVars: {
			'--theme-bg': '#f5f3ea',
			'--theme-card-bg': '#ffffff',
			'--theme-card-border': '4px solid #10172b',
			'--theme-card-shadow': '8px 8px 0px #10172b',
			'--theme-card-radius': '0px',
			'--theme-tag-radius': '0px',
			'--theme-card-backdrop': 'none',
			'--theme-text-primary': '#10172b',
			'--theme-text-secondary': '#394057',
			'--theme-accent': '#ff6f31',
			'--theme-tag-bg': '#11d7d1',
			'--theme-tag-border': '3px solid #10172b',
			'--theme-tag-text': '#10172b',
			'--theme-btn-bg': '#10172b',
			'--theme-btn-text': '#ffffff',
			'--theme-btn-radius': '0px',
			'--theme-btn-border': '3px solid #10172b',
			'--theme-btn-shadow': '4px 4px 0px #10172b',
			'--theme-avatar-border': '3px solid #10172b',
			'--theme-separator': '#10172b',
			'--theme-hover-lift': '-4px',
			'--theme-hover-shadow': '10px 10px 0px #10172b',
		},
	},
	{
		id: 'neumorphism',
		name: 'Neumorphism',
		description: 'Soft extruded surfaces with subtle depth like digital clay',
		previewColors: ['#e0e5ec', '#c8d0e7', '#a3b1c6'],
		pageClasses: 'text-[#5a6a85]',
		cssVars: {
			'--theme-bg': '#e0e5ec',
			'--theme-card-bg': '#e0e5ec',
			'--theme-card-border': '1px solid rgba(255,255,255,0.4)',
			'--theme-card-shadow':
				'9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
			'--theme-card-radius': '1.25rem',
			'--theme-tag-radius': '0.5rem',
			'--theme-card-backdrop': 'none',
			'--theme-text-primary': '#1e293b',
			'--theme-text-secondary': '#475569',
			'--theme-accent': '#4299e1',
			'--theme-tag-bg': 'rgba(163,177,198,0.15)',
			'--theme-tag-border': '1px solid rgba(255,255,255,0.2)',
			'--theme-tag-text': '#1e293b',
			'--theme-btn-bg': '#e0e5ec',
			'--theme-btn-text': '#1e293b',
			'--theme-btn-radius': '0.75rem',
			'--theme-btn-border': '1px solid rgba(255,255,255,0.5)',
			'--theme-btn-shadow': '5px 5px 10px #b8bec7, -5px -5px 10px #ffffff',
			'--theme-avatar-border': '2px solid #e0e5ec',
			'--theme-separator': 'rgba(163,177,198,0.3)',
			'--theme-hover-lift': '-2px',
			'--theme-hover-shadow':
				'12px 12px 20px rgba(163,177,198,0.7), -12px -12px 20px rgba(255,255,255, 0.6)',
		},
	},
	{
		id: 'retro-pop',
		name: 'Retro Pop',
		description: 'Soft pastel bubbles with chunky rounded forms and warmth',
		previewColors: ['#fef3c7', '#fde68a', '#f9a8d4'],
		pageClasses: 'text-[#2d1b69]',
		cssVars: {
			'--theme-bg': 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ede9fe 100%)',
			'--theme-card-bg': '#ffffff',
			'--theme-card-border': '2px solid rgba(255,255,255,0.9)',
			'--theme-card-shadow':
				'0 8px 0px #d4b8e0, 0 12px 24px rgba(180,140,220,0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
			'--theme-card-radius': '2rem',
			'--theme-tag-radius': '1rem',
			'--theme-card-backdrop': 'none',
			'--theme-text-primary': '#1e1047',
			'--theme-text-secondary': '#4c1d95',
			'--theme-accent': '#e879f9',
			'--theme-tag-bg': '#ede9fe',
			'--theme-tag-border': 'rgba(167,139,250,0.4)',
			'--theme-tag-text': '#4c1d95',
			'--theme-btn-bg': '#2d1b69',
			'--theme-btn-text': '#fef3c7',
			'--theme-btn-radius': '1rem',
			'--theme-btn-border': 'none',
			'--theme-btn-shadow': '0 4px 0px #1e1047',
			'--theme-avatar-border': '3px solid #ffffff',
			'--theme-separator': 'rgba(167,139,250,0.3)',
			'--theme-hover-lift': '-4px',
			'--theme-hover-shadow': '0 12px 0px #d4b8e0, 0 16px 32px rgba(180,140,220,0.3)',
		},
	},
	{
		id: 'claymorphism',
		name: 'Claymorphism',
		description: 'A soft 3D UI design style where elements look like smooth molded clay',
		previewColors: ['#f0f4f8', '#ffffff', '#cbd5e1'],
		pageClasses: 'text-[#334155]',
		cssVars: {
			'--theme-bg': '#f0f4f8',
			'--theme-card-bg': '#ffffff',
			'--theme-card-border': 'none',
			'--theme-card-shadow':
				'8px 8px 16px rgba(0, 0, 0, 0.04), -8px -8px 16px rgba(255, 255, 255, 0.8), inset 4px 4px 8px rgba(255, 255, 255, 0.8), inset -4px -4px 8px rgba(0, 0, 0, 0.03)',
			'--theme-card-radius': '2.5rem',
			'--theme-tag-radius': '1.5rem',
			'--theme-card-backdrop': 'none',
			'--theme-text-primary': '#334155',
			'--theme-text-secondary': '#64748b',
			'--theme-accent': '#f472b6',
			'--theme-tag-bg': '#f8fafc',
			'--theme-tag-border': 'none',
			'--theme-tag-text': '#475569',
			'--theme-btn-bg': '#3b82f6',
			'--theme-btn-text': '#ffffff',
			'--theme-btn-radius': '1.5rem',
			'--theme-btn-border': 'none',
			'--theme-btn-shadow':
				'4px 4px 8px rgba(59, 130, 246, 0.3), inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.1)',
			'--theme-avatar-border': '4px solid #ffffff',
			'--theme-separator': 'rgba(0,0,0,0.05)',
			'--theme-hover-lift': '-2px',
			'--theme-hover-shadow':
				'12px 12px 24px rgba(0, 0, 0, 0.06), -12px -12px 24px #ffffff, inset 4px 4px 8px rgba(255, 255, 255, 0.8), inset -4px -4px 8px rgba(0, 0, 0, 0.03)',
		},
	},
	{
		id: 'terminal',
		name: 'Terminal',
		description: 'Classic green monochrome command-line interface',
		previewColors: ['#000000', '#00ff00', '#004400'],
		pageClasses: 'text-[#00ff00] font-mono',
		cssVars: {
			'--theme-bg': '#000000',
			'--theme-card-bg': '#050505',
			'--theme-card-border': '1px solid #00ff00',
			'--theme-card-shadow': '0 0 10px rgba(0, 255, 0, 0.15)',
			'--theme-card-radius': '0px',
			'--theme-tag-radius': '0px',
			'--theme-card-backdrop': 'none',
			'--theme-text-primary': '#00ff00',
			'--theme-text-secondary': '#00aa00',
			'--theme-accent': '#00ff00',
			'--theme-tag-bg': '#002200',
			'--theme-tag-border': '1px solid #00ff00',
			'--theme-tag-text': '#00ff00',
			'--theme-btn-bg': '#002200',
			'--theme-btn-text': '#00ff00',
			'--theme-btn-radius': '0px',
			'--theme-btn-border': '1px solid #00ff00',
			'--theme-btn-shadow': '0 0 5px rgba(0, 255, 0, 0.3)',
			'--theme-avatar-border': '1px solid #00ff00',
			'--theme-separator': '#004400',
			'--theme-hover-lift': '0px',
			'--theme-hover-shadow': '0 0 15px rgba(0, 255, 0, 0.4)',
		},
	},
];

export const DEFAULT_THEME_ID: ThemeId = 'glassmorphism';

export function getTheme(id: string | null | undefined): ThemeDefinition {
	return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
