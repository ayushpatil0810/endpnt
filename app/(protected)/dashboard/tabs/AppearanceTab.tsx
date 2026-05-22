'use client';

import { ThemePicker } from '@/components/ThemePicker';
import { LayoutPicker } from '@/components/LayoutPicker';
import { useDashboardStore } from '@/lib/stores/dashboard-store-provider';
import type { ThemeId } from '@/lib/themes';
import type { LayoutId } from '@/lib/layouts';

export function AppearanceTab() {
	const theme = useDashboardStore((s) => s.theme);
	const layout = useDashboardStore((s) => s.layout);
	const setTheme = useDashboardStore((s) => s.setTheme);
	const setLayout = useDashboardStore((s) => s.setLayout);

	return (
		<div className="flex flex-col gap-12">
			<div>
				<h2 className="text-lg font-semibold text-foreground mb-6">Theme & Appearance</h2>
				<ThemePicker currentTheme={theme} onThemeChange={setTheme as (val: ThemeId) => void} />
			</div>

			<div>
				<h2 className="text-lg font-semibold text-foreground mb-6">Layout Structure</h2>
				<LayoutPicker
					currentLayout={layout}
					onLayoutChange={setLayout as (val: LayoutId) => void}
				/>
			</div>
		</div>
	);
}
