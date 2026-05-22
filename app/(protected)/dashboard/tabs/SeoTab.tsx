'use client';

import { useCallback } from 'react';
import { useDashboardStore } from '@/lib/stores/dashboard-store-provider';
import { toast } from 'sonner';

export function SeoTab() {
	const seoTitle = useDashboardStore((s) => s.seoTitle);
	const seoDescription = useDashboardStore((s) => s.seoDescription);
	const setSeoTitle = useDashboardStore((s) => s.setSeoTitle);
	const setSeoDescription = useDashboardStore((s) => s.setSeoDescription);

	const handleSeoSave = useCallback(async () => {
		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ seoTitle, seoDescription }),
			});
			if (!res.ok) throw new Error('Failed to save SEO');
			toast.success('SEO settings updated!');
		} catch {
			toast.error('Failed to update SEO settings');
		}
	}, [seoTitle, seoDescription]);

	const labelClass = 'text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1';
	const inputClass =
		'w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case';

	return (
		<div>
			<h2 className="text-lg font-semibold text-foreground mb-6">SEO & Social Sharing</h2>
			<div className="flex flex-col gap-5 max-w-xl">
				<div className="flex flex-col gap-2">
					<label className={labelClass}>Meta Title</label>
					<input
						value={seoTitle}
						onChange={(e) => setSeoTitle(e.target.value)}
						placeholder="e.g. John Doe - Full-stack Engineer"
						className={inputClass}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className={labelClass}>Meta Description</label>
					<textarea
						value={seoDescription}
						onChange={(e) => setSeoDescription(e.target.value)}
						placeholder="e.g. Check out my latest articles and source code."
						className={`${inputClass} min-h-32 resize-none`}
					/>
				</div>
				<div className="mt-2">
					<button
						onClick={handleSeoSave}
						className="bg-foreground text-background px-6 py-2.5 rounded-md text-[10px] uppercase tracking-widest font-medium transition-colors hover:bg-foreground/90"
					>
						Save SEO Settings
					</button>
				</div>
			</div>
		</div>
	);
}
