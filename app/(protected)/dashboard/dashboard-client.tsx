'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	sortableKeyboardCoordinates,
	arrayMove,
} from '@dnd-kit/sortable';
import dynamic from 'next/dynamic';
import { IconLoader2 } from '@tabler/icons-react';

const AnalyticsDashboard = dynamic(
	() => import('@/components/AnalyticsDashboard').then((mod) => mod.AnalyticsDashboard),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-100 flex items-center justify-center border border-border/40 bg-card/10">
				<IconLoader2 className="animate-spin text-muted-foreground" />
			</div>
		),
	}
);

import { ShareModal } from '@/components/ShareModal';
import { LinksTab } from './tabs/LinksTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ProfileTab } from './tabs/ProfileTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { SeoTab } from './tabs/SeoTab';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
	IconSun,
	IconMoon,
	IconExternalLink,
	IconLogout,
	IconShare,
	IconChartBar,
	IconLink,
	IconBriefcase,
	IconUser,
	IconPalette,
	IconSettings,
	IconEye,
	IconClick,
	IconTrendingUp,
} from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store-provider';
import type { DashboardInitialData } from '@/lib/stores/dashboard-store';

type Tab = 'analytics' | 'links' | 'projects' | 'profile' | 'appearance' | 'seo';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
	{ id: 'analytics', label: 'Analytics', icon: IconChartBar },
	{ id: 'links', label: 'Links', icon: IconLink },
	{ id: 'projects', label: 'Projects', icon: IconBriefcase },
	{ id: 'profile', label: 'Profile & Dev', icon: IconUser },
	{ id: 'appearance', label: 'Appearance', icon: IconPalette },
	{ id: 'seo', label: 'SEO Settings', icon: IconSettings },
];

/**
 * DashboardClient is now a thin orchestrator — all state lives in the
 * Zustand store (DashboardStoreProvider). This component only handles:
 *  - DnD sensors and drag end handlers (need access to multiple actions together)
 *  - Theme toggle with View Transition animation
 *  - Sign out
 *  - Keyboard shortcut (Cmd+K)
 *  - Derived analytics values (views, clicks, CTR)
 */
export function DashboardClient({ initialData }: { initialData: DashboardInitialData }) {
	const router = useRouter();
	const toggleBtnRef = useRef<HTMLButtonElement>(null);

	const user = useDashboardStore((s) => s.user);
	const links = useDashboardStore((s) => s.links);
	const projects = useDashboardStore((s) => s.projects);
	const initialEvents = useDashboardStore((s) => s.initialEvents);
	const authUser = useDashboardStore((s) => s.authUser);
	const activeTab = useDashboardStore((s) => s.activeTab);
	const dashboardTheme = useDashboardStore((s) => s.dashboardTheme);
	const isShareModalOpen = useDashboardStore((s) => s.isShareModalOpen);
	const avatarUrl = authUser.image ?? user.avatarUrl ?? null;

	const setLinks = useDashboardStore((s) => s.setLinks);
	const setProjects = useDashboardStore((s) => s.setProjects);
	const setActiveTab = useDashboardStore((s) => s.setActiveTab);
	const setDashboardTheme = useDashboardStore((s) => s.setDashboardTheme);
	const setShareModalOpen = useDashboardStore((s) => s.setShareModalOpen);

	const [origin, setOrigin] = useState('https://endpnt.dev');
	useEffect(() => {
		setOrigin(window.location.origin);
	}, []);
	const profileUrl = `${origin}/${user.username}`;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				setActiveTab('links');
				setTimeout(() => document.getElementById('add-new-link-btn')?.click(), 100);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [setActiveTab]);

	const handleThemeToggle = useCallback(() => {
		const btn = toggleBtnRef.current;
		const isGoingLight = dashboardTheme === 'dark';
		const newTheme = isGoingLight ? 'light' : ('dark' as const);

		if (!document.startViewTransition) {
			setDashboardTheme(newTheme);
			return;
		}

		const x = btn ? btn.getBoundingClientRect().left + btn.offsetWidth / 2 : window.innerWidth / 2;
		const y = btn ? btn.getBoundingClientRect().top + btn.offsetHeight / 2 : window.innerHeight / 2;
		const maxRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		const transition = document.startViewTransition(() => {
			flushSync(() => setDashboardTheme(newTheme));
		});

		transition.ready.then(() => {
			document.documentElement.animate(
				{
					clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
				},
				{
					duration: 600,
					easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
					pseudoElement: '::view-transition-new(root)',
				}
			);
		});
	}, [dashboardTheme, setDashboardTheme]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = links.findIndex((l) => l.id === active.id);
		const newIndex = links.findIndex((l) => l.id === over.id);
		const reordered = arrayMove(links, oldIndex, newIndex).map((link, idx) => ({
			...link,
			displayOrder: idx,
		}));
		setLinks(reordered);
		try {
			const res = await fetch('/api/links/reorder', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					updates: reordered.map((l) => ({
						id: l.id,
						displayOrder: l.displayOrder,
					})),
				}),
			});
			if (!res.ok) throw new Error('Sync failed');
		} catch {
			toast.error('Failed to save order.');
		}
	}

	async function handleProjectDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = projects.findIndex((p) => p.id === active.id);
		const newIndex = projects.findIndex((p) => p.id === over.id);
		const reordered = arrayMove(projects, oldIndex, newIndex).map((p, idx) => ({
			...p,
			displayOrder: idx,
		}));
		setProjects(reordered);
		try {
			const res = await fetch('/api/projects/reorder', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					updates: reordered.map((p) => ({
						id: p.id,
						displayOrder: p.displayOrder,
					})),
				}),
			});
			if (!res.ok) throw new Error('Sync failed');
		} catch {
			toast.error('Failed to save project order.');
		}
	}

	const handleSignOut = useCallback(async () => {
		await signOut();
		router.push('/');
	}, [router]);

	const totalViews = user.views ?? 0;
	const totalClicks = links.reduce((sum, link) => sum + (link.clicks ?? 0), 0);
	const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

	return (
		<div
			data-dashboard-theme={dashboardTheme}
			className="min-h-dvh bg-background flex flex-col font-sans selection:bg-primary/20"
		>
			{/* Top Nav */}
			<nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-8 py-3 flex items-center justify-between">
				<div className="font-bold text-sm tracking-widest text-foreground uppercase font-mono">
					endpnt.
				</div>
				<div className="flex items-center gap-2 sm:gap-4">
					<button
						ref={toggleBtnRef}
						aria-label="Toggle theme"
						onClick={handleThemeToggle}
						className="relative flex items-center justify-center size-8 rounded-full border border-border/50 bg-card/40 hover:bg-card/80 text-foreground transition-all duration-200 cursor-pointer overflow-hidden"
					>
						<AnimatePresence mode="wait" initial={false}>
							{dashboardTheme === 'dark' ? (
								<motion.span
									key="moon"
									initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
									animate={{ rotate: 0, opacity: 1, scale: 1 }}
									exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
									transition={{ duration: 0.2, ease: 'easeOut' }}
									className="absolute flex items-center justify-center"
								>
									<IconMoon size={14} stroke={1.5} />
								</motion.span>
							) : (
								<motion.span
									key="sun"
									initial={{ rotate: 30, opacity: 0, scale: 0.6 }}
									animate={{ rotate: 0, opacity: 1, scale: 1 }}
									exit={{ rotate: -30, opacity: 0, scale: 0.6 }}
									transition={{ duration: 0.2, ease: 'easeOut' }}
									className="absolute flex items-center justify-center"
								>
									<IconSun size={14} stroke={1.5} />
								</motion.span>
							)}
						</AnimatePresence>
					</button>

					<button
						onClick={() => setShareModalOpen(true)}
						className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest font-semibold text-background bg-foreground hover:bg-foreground/90 transition-colors px-3 py-1.5 rounded-md"
						aria-label="Share profile"
					>
						<IconShare size={14} />
						<span className="hidden sm:inline">Share</span>
					</button>

					<a
						href={profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-foreground hover:bg-muted border border-border/50 hover:border-border transition-colors px-3 py-1.5 rounded-md"
						aria-label="View profile"
					>
						<IconExternalLink size={14} />
						<span className="hidden sm:inline">View Profile</span>
					</a>
				</div>
			</nav>

			{/* Main Workspace */}
			<main className="flex-1 w-full max-w-400 mx-auto flex overflow-hidden h-[calc(100vh-56px)]">
				{/* Left Sidebar Navigation */}
				<aside className="w-64 border-r border-border/40 bg-background flex-col pt-6 pb-6 overflow-y-auto hidden md:flex shrink-0">
					<div className="px-6 pb-6 mb-2 border-b border-border/20">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full border border-border/30 overflow-hidden bg-card/20 shrink-0 relative">
								{avatarUrl ? (
									<Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="40px" />
								) : (
									<div className="size-full flex items-center justify-center font-serif italic text-muted-foreground">
										{user.username.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
							<div className="flex flex-col overflow-hidden">
								<span className="text-sm font-semibold truncate text-foreground normal-case">
									{user.username}
								</span>
								<span className="text-[10px] uppercase font-mono text-muted-foreground truncate">
									{origin.replace(/^https?:\/\//, '')}/{user.username}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col px-3 gap-1">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
										isActive
											? 'bg-foreground/10 text-foreground font-medium'
											: 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
									}`}
								>
									<Icon size={18} stroke={isActive ? 2 : 1.5} />
									{tab.label}
								</button>
							);
						})}
					</div>

					<div className="mt-auto px-3 border-t border-border/20 pt-4">
						<button
							onClick={handleSignOut}
							className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full rounded-lg transition-colors"
						>
							<IconLogout size={18} stroke={1.5} />
							Sign Out
						</button>
					</div>
				</aside>

				{/* Center Content Workspace */}
				<div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-24 md:pb-8 relative hide-scrollbar">
					<div className="w-full max-w-5xl mx-auto flex flex-col">
						<div className="flex-1 w-full">
							<AnimatePresence mode="wait">
								<motion.div
									key={activeTab}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.15 }}
									className="flex flex-col gap-8 pb-20"
								>
									{activeTab === 'analytics' && (
										<div className="flex flex-col gap-6">
											<h2 className="text-lg font-semibold text-foreground mt-4">
												Detailed Analytics
											</h2>
											<AnalyticsDashboard
												views={user.views ?? 0}
												links={links}
												events={initialEvents}
											/>
										</div>
									)}

									{activeTab === 'links' && (
										<LinksTab sensors={sensors} handleDragEnd={handleDragEnd} />
									)}

									{activeTab === 'projects' && (
										<ProjectsTab sensors={sensors} handleProjectDragEnd={handleProjectDragEnd} />
									)}

									{activeTab === 'profile' && <ProfileTab />}

									{activeTab === 'appearance' && <AppearanceTab />}

									{activeTab === 'seo' && <SeoTab />}
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</main>

			{/* Mobile Bottom Nav */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/80 backdrop-blur-md z-40 px-2 py-2 pb-6">
				<div className="flex items-center justify-around">
					{TABS.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
									isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
								}`}
							>
								<Icon size={20} stroke={isActive ? 2 : 1.5} />
								<span className="text-[9px] font-medium">{tab.label.split(' ')[0]}</span>
							</button>
						);
					})}
				</div>
			</div>

			<ShareModal
				isOpen={isShareModalOpen}
				onClose={() => setShareModalOpen(false)}
				profileUrl={profileUrl}
				username={user.username}
			/>
		</div>
	);
}
