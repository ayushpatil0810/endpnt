'use client';

import { createContext, useContext, useRef, useEffect, type ReactNode } from 'react';
import { useStore } from 'zustand';
import {
	createDashboardStore,
	type DashboardStore,
	type DashboardState,
	type DashboardInitialData,
} from './dashboard-store';

// ── Context ────────────────────────────────────────────────────────────────────

const DashboardStoreContext = createContext<DashboardStore | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

interface DashboardStoreProviderProps {
	children: ReactNode;
	initialData: DashboardInitialData;
}

const DASHBOARD_THEME_KEY = 'endpnt-dashboard-theme';

/**
 * Creates a Zustand store instance scoped to this render and provides it
 * via context. The store is initialised with server-fetched data so the
 * first render is never empty (no loading flash).
 *
 * Dashboard theme is persisted to localStorage and rehydrated on mount,
 * matching the original behaviour.
 */
export function DashboardStoreProvider({ children, initialData }: DashboardStoreProviderProps) {
	const storeRef = useRef<DashboardStore>(null);

	if (!storeRef.current) {
		storeRef.current = createDashboardStore(initialData);
	}

	// Rehydrate dashboard theme from localStorage (client-only)
	useEffect(() => {
		const stored = window.localStorage.getItem(DASHBOARD_THEME_KEY);
		if (stored === 'light' || stored === 'dark') {
			storeRef.current!.getState().setDashboardTheme(stored);
		}
	}, []);

	// Persist dashboard theme changes to localStorage
	useEffect(() => {
		return storeRef.current!.subscribe((state, prevState) => {
			if (state.dashboardTheme !== prevState.dashboardTheme) {
				window.localStorage.setItem(DASHBOARD_THEME_KEY, state.dashboardTheme);
			}
		});
	}, []);

	return (
		<DashboardStoreContext.Provider value={storeRef.current}>
			{children}
		</DashboardStoreContext.Provider>
	);
}

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Access the dashboard store. Must be used inside DashboardStoreProvider.
 *
 * Usage:
 *   const links = useDashboardStore((s) => s.links);
 *   const addLink = useDashboardStore((s) => s.addLink);
 */
export function useDashboardStore<T>(selector: (state: DashboardState) => T): T {
	const store = useContext(DashboardStoreContext);
	if (!store) {
		throw new Error('useDashboardStore must be used within DashboardStoreProvider');
	}
	return useStore(store, selector);
}
