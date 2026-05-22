'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
	IconCheck,
	IconLoader2,
	IconLayoutSidebar,
	IconLayoutDashboard,
	IconLayoutAlignCenter,
} from '@tabler/icons-react';
import { LAYOUTS, type LayoutId } from '@/lib/layouts';
import { cn } from '@/lib/utils';

interface LayoutPickerProps {
	currentLayout: LayoutId | string;
	onLayoutChange: (layout: LayoutId) => void;
}

const LAYOUT_ICONS: Record<string, React.ElementType> = {
	sidebar: IconLayoutSidebar,
	bento: IconLayoutDashboard,
	minimal: IconLayoutAlignCenter,
};

export function LayoutPicker({ currentLayout, onLayoutChange }: LayoutPickerProps) {
	const [saving, setSaving] = useState(false);

	const handleUpdate = async (layoutId: LayoutId) => {
		if (layoutId === currentLayout) return;
		setSaving(true);
		onLayoutChange(layoutId); // optimistic

		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ layout: layoutId }),
			});
			if (!res.ok) throw new Error('Sync failed');
			toast.success('Layout updated!');
		} catch {
			toast.error('Failed to update layout.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-between border-b border-border/40 pb-4">
				<div>
					<h2 className="text-sm font-semibold text-foreground">Profile Layout</h2>
					<p className="text-[11px] text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">
						Choose a structural layout for your profile
					</p>
				</div>
				{saving && (
					<span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-muted-foreground animate-pulse">
						<IconLoader2 size={12} className="animate-spin" />
						Saving
					</span>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{LAYOUTS.map((layout) => {
					const isActive = currentLayout === layout.id;
					const Icon = LAYOUT_ICONS[layout.id] || IconLayoutDashboard;

					return (
						<button
							key={layout.id}
							onClick={() => handleUpdate(layout.id as LayoutId)}
							className={cn(
								'group relative flex flex-col gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left',
								isActive
									? 'border-foreground bg-foreground/5 shadow-md'
									: 'border-border/50 hover:border-foreground/50 bg-card/10'
							)}
						>
							{/* Mini Preview Representation */}
							<div className="w-full h-28 rounded-lg overflow-hidden flex items-center justify-center relative shadow-sm border border-border/50 bg-background/50">
								{isActive && (
									<div className="absolute top-2 right-2 flex items-center gap-1 bg-foreground text-background rounded-full px-2 py-0.5 z-20 shadow-md">
										<IconCheck size={10} stroke={3} />
									</div>
								)}

								<Icon
									size={40}
									className="text-muted-foreground group-hover:text-foreground transition-colors opacity-50"
									stroke={1.5}
								/>
							</div>

							{/* Info */}
							<div className="flex flex-col gap-1.5 z-10 w-full">
								<span className="text-sm font-semibold text-foreground">{layout.name}</span>
								<p className="text-[11px] text-muted-foreground leading-snug">
									{layout.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
