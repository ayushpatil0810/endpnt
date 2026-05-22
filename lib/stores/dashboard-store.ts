/**
 * Zustand store for the dashboard.
 *
 * Replaces 15+ useState declarations in DashboardClient with a single,
 * typed store. All tab components read/write here directly — no prop drilling.
 *
 * The store is created fresh per-user session via DashboardStoreProvider
 * (context pattern), so it's safe with React Server Components and
 * Next.js App Router.
 */

import { createStore } from 'zustand';
import type { User, Link as DbLink, Project } from '@/db/schema/schema';
import type { ThemeId } from '@/lib/themes';
import type { LayoutId } from '@/lib/layouts';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DashboardTheme = 'dark' | 'light';
export type Tab = 'analytics' | 'links' | 'projects' | 'profile' | 'appearance' | 'seo';

export interface DashboardInitialData {
	user: User;
	initialLinks: DbLink[];
	initialProjects: Project[];
	initialEvents: { type: string; createdAt: Date }[];
	authUser: { name: string; image: string | null };
}

export interface DashboardState {
	// ── Server data ──────────────────────────────────────────────────────────
	user: User;
	links: DbLink[];
	projects: Project[];
	initialEvents: { type: string; createdAt: Date }[];
	authUser: { name: string; image: string | null };

	// ── Editable profile fields ──────────────────────────────────────────────
	bio: string;
	githubUsername: string;
	leetcodeUsername: string;
	devtoUsername: string;
	mediumUsername: string;
	hashnodeUsername: string;
	seoTitle: string;
	seoDescription: string;

	// ── Appearance (current selection + live-preview state) ──────────────────
	theme: ThemeId | string;
	layout: LayoutId | string;

	// ── UI state ─────────────────────────────────────────────────────────────
	activeTab: Tab;
	dashboardTheme: DashboardTheme;
	isShareModalOpen: boolean;

	// ── Link actions ─────────────────────────────────────────────────────────
	addLink: (link: DbLink) => void;
	updateLink: (link: DbLink) => void;
	deleteLink: (id: string) => void;
	setLinks: (links: DbLink[]) => void;

	// ── Project actions ──────────────────────────────────────────────────────
	addProject: (project: Project) => void;
	updateProject: (project: Project) => void;
	deleteProject: (id: string) => void;
	setProjects: (projects: Project[]) => void;

	// ── Profile field setters ────────────────────────────────────────────────
	setBio: (bio: string) => void;
	setGithubUsername: (val: string) => void;
	setLeetcodeUsername: (val: string) => void;
	setDevtoUsername: (val: string) => void;
	setMediumUsername: (val: string) => void;
	setHashnodeUsername: (val: string) => void;
	setSeoTitle: (val: string) => void;
	setSeoDescription: (val: string) => void;

	// ── Appearance setters ───────────────────────────────────────────────────
	setTheme: (theme: ThemeId) => void;
	setLayout: (layout: LayoutId) => void;

	// ── UI setters ───────────────────────────────────────────────────────────
	setActiveTab: (tab: Tab) => void;
	setDashboardTheme: (theme: DashboardTheme) => void;
	setShareModalOpen: (open: boolean) => void;
}

// ── Store factory ─────────────────────────────────────────────────────────────

export type DashboardStore = ReturnType<typeof createDashboardStore>;

export function createDashboardStore(init: DashboardInitialData) {
	return createStore<DashboardState>()((set) => ({
		// Initial server data
		user: init.user,
		links: init.initialLinks,
		projects: init.initialProjects,
		initialEvents: init.initialEvents,
		authUser: init.authUser,

		// Initial profile field values from user record
		bio: init.user.bio ?? '',
		githubUsername: init.user.githubUsername ?? '',
		leetcodeUsername: init.user.leetcodeUsername ?? '',
		devtoUsername: init.user.devtoUsername ?? '',
		mediumUsername: init.user.mediumUsername ?? '',
		hashnodeUsername: init.user.hashnodeUsername ?? '',
		seoTitle: init.user.seoTitle ?? '',
		seoDescription: init.user.seoDescription ?? '',

		// Appearance
		theme: init.user.theme ?? 'glassmorphism',
		layout: init.user.layout ?? 'sidebar',

		// UI
		activeTab: 'links',
		dashboardTheme: 'dark',
		isShareModalOpen: false,

		// ── Link actions ────────────────────────────────────────────────────────
		addLink: (link) => set((state) => ({ links: [...state.links, link] })),
		updateLink: (updated) =>
			set((state) => ({
				links: state.links.map((l) => (l.id === updated.id ? updated : l)),
			})),
		deleteLink: (id) => set((state) => ({ links: state.links.filter((l) => l.id !== id) })),
		setLinks: (links) => set({ links }),

		// ── Project actions ─────────────────────────────────────────────────────
		addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
		updateProject: (updated) =>
			set((state) => ({
				projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
			})),
		deleteProject: (id) =>
			set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
		setProjects: (projects) => set({ projects }),

		// ── Profile field setters ────────────────────────────────────────────────
		setBio: (bio) => set({ bio }),
		setGithubUsername: (githubUsername) => set({ githubUsername }),
		setLeetcodeUsername: (leetcodeUsername) => set({ leetcodeUsername }),
		setDevtoUsername: (devtoUsername) => set({ devtoUsername }),
		setMediumUsername: (mediumUsername) => set({ mediumUsername }),
		setHashnodeUsername: (hashnodeUsername) => set({ hashnodeUsername }),
		setSeoTitle: (seoTitle) => set({ seoTitle }),
		setSeoDescription: (seoDescription) => set({ seoDescription }),

		// ── Appearance setters ───────────────────────────────────────────────────
		setTheme: (theme) => set({ theme }),
		setLayout: (layout) => set({ layout }),

		// ── UI setters ───────────────────────────────────────────────────────────
		setActiveTab: (activeTab) => set({ activeTab }),
		setDashboardTheme: (dashboardTheme) => set({ dashboardTheme }),
		setShareModalOpen: (isShareModalOpen) => set({ isShareModalOpen }),
	}));
}
