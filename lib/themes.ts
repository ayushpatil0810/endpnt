import type { CSSProperties } from "react";

export const THEME_IDS = [
  "glassmorphism",
  "neo-brutalism",
  "neumorphism",
  "claymorphism",
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
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass panels floating on a deep gradient cosmos",
    previewColors: ["#0f0c29", "#302b63", "#24243e"],
    pageClasses: "text-white",
    cssVars: {
      "--theme-bg": "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #0d1b2a 100%)",
      "--theme-card-bg": "rgba(255, 255, 255, 0.05)",
      "--theme-card-border": "1px solid rgba(255, 255, 255, 0.12)",
      "--theme-card-shadow": "0 8px 32px rgba(0, 0, 0, 0.4)",
      "--theme-card-radius": "1.5rem",
      "--theme-card-backdrop": "blur(20px)",
      "--theme-text-primary": "#ffffff",
      "--theme-text-secondary": "rgba(255, 255, 255, 0.75)",
      "--theme-accent": "rgba(160, 100, 255, 0.7)",
      "--theme-tag-bg": "rgba(255, 255, 255, 0.07)",
      "--theme-tag-border": "rgba(255, 255, 255, 0.12)",
      "--theme-tag-text": "#ffffff",
      "--theme-btn-bg": "#ffffff",
      "--theme-btn-text": "#0f0c29",
      "--theme-separator": "rgba(255, 255, 255, 0.15)",
      "--theme-hover-lift": "-6px",
      "--theme-hover-shadow": "0 16px 48px rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: "neo-brutalism",
    name: "Neo Brutalism",
    description: "Raw, bold, unapologetically loud with borders and offset shadows",
    previewColors: ["#f5f3ea", "#11d7d1", "#10172b"],
    pageClasses: "text-[#10172b]",
    cssVars: {
      "--theme-bg": "#f5f3ea",
      "--theme-card-bg": "#ffffff",
      "--theme-card-border": "4px solid #10172b",
      "--theme-card-shadow": "8px 8px 0px #10172b",
      "--theme-card-radius": "1.5rem",
      "--theme-card-backdrop": "none",
      "--theme-text-primary": "#10172b",
      "--theme-text-secondary": "#394057",
      "--theme-accent": "#ff6f31",
      "--theme-tag-bg": "#11d7d1",
      "--theme-tag-border": "3px solid #10172b",
      "--theme-tag-text": "#10172b",
      "--theme-btn-bg": "#10172b",
      "--theme-btn-text": "#ffffff",
      "--theme-separator": "#10172b",
      "--theme-hover-lift": "-4px",
      "--theme-hover-shadow": "10px 10px 0px #10172b",
    },
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft extruded surfaces with subtle depth like digital clay",
    previewColors: ["#e0e5ec", "#c8d0e7", "#a3b1c6"],
    pageClasses: "text-[#5a6a85]",
    cssVars: {
      "--theme-bg": "#e0e5ec",
      "--theme-card-bg": "#e0e5ec",
      "--theme-card-border": "1px solid rgba(255,255,255,0.4)",
      "--theme-card-shadow":
        "9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)",
      "--theme-card-radius": "1.5rem",
      "--theme-card-backdrop": "none",
      "--theme-text-primary": "#1e293b",
      "--theme-text-secondary": "#475569",
      "--theme-accent": "#4299e1",
      "--theme-tag-bg": "rgba(163,177,198,0.15)",
      "--theme-tag-border": "1px solid rgba(255,255,255,0.2)",
      "--theme-tag-text": "#1e293b",
      "--theme-btn-bg": "#e0e5ec",
      "--theme-btn-text": "#1e293b",
      "--theme-btn-shadow":
        "5px 5px 10px #b8bec7, -5px -5px 10px #ffffff",
      "--theme-separator": "rgba(163,177,198,0.3)",
      "--theme-hover-lift": "-2px",
      "--theme-hover-shadow":
        "12px 12px 20px rgba(163,177,198,0.7), -12px -12px 20px rgba(255,255,255, 0.6)",
    },
  },
  {
    id: "claymorphism",
    name: "Claymorphism",
    description: "Soft pastel bubbles with chunky rounded forms and warmth",
    previewColors: ["#fef3c7", "#fde68a", "#f9a8d4"],
    pageClasses: "text-[#2d1b69]",
    cssVars: {
      "--theme-bg": "linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ede9fe 100%)",
      "--theme-card-bg": "#ffffff",
      "--theme-card-border": "2px solid rgba(255,255,255,0.9)",
      "--theme-card-shadow":
        "0 8px 0px #d4b8e0, 0 12px 24px rgba(180,140,220,0.25), inset 0 1px 0 rgba(255,255,255,0.9)",
      "--theme-card-radius": "2rem",
      "--theme-card-backdrop": "none",
      "--theme-text-primary": "#1e1047",
      "--theme-text-secondary": "#4c1d95",
      "--theme-accent": "#e879f9",
      "--theme-tag-bg": "#ede9fe",
      "--theme-tag-border": "rgba(167,139,250,0.4)",
      "--theme-tag-text": "#4c1d95",
      "--theme-btn-bg": "#2d1b69",
      "--theme-btn-text": "#fef3c7",
      "--theme-separator": "rgba(167,139,250,0.3)",
      "--theme-hover-lift": "-4px",
      "--theme-hover-shadow":
        "0 12px 0px #d4b8e0, 0 16px 32px rgba(180,140,220,0.3)",
    },
  },
];

export const DEFAULT_THEME_ID: ThemeId = "glassmorphism";

/** Border-radius per theme — consumed by ThemedCard and PublicLinkButton. */
export const RADIUS_MAP: Record<string, string> = {
  glassmorphism: "1.5rem",
  "neo-brutalism": "0px",
  neumorphism: "1.25rem",
  claymorphism: "2rem",
};

export function getTheme(id: string | null | undefined): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
