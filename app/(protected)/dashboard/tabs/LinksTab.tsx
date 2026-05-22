'use client';

import {
	DndContext,
	closestCenter,
	type DragEndEvent,
	type SensorDescriptor,
	type SensorOptions,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LinkCard } from '@/components/LinkCard';
import { LinkForm } from '@/components/LinkForm';
import { useDashboardStore } from '@/lib/stores/dashboard-store-provider';

interface LinksTabProps {
	sensors: SensorDescriptor<SensorOptions>[];
	handleDragEnd: (event: DragEndEvent) => void;
}

export function LinksTab({ sensors, handleDragEnd }: LinksTabProps) {
	const links = useDashboardStore((s) => s.links);
	const updateLink = useDashboardStore((s) => s.updateLink);
	const deleteLink = useDashboardStore((s) => s.deleteLink);
	const addLink = useDashboardStore((s) => s.addLink);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-foreground">Manage Links</h2>
				<span className="text-xs font-mono text-muted-foreground bg-foreground/5 px-2 py-1 rounded-md border border-border/40">
					{links.length} Links
				</span>
			</div>

			<DndContext
				id="links-dnd"
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
					<div className="flex flex-col gap-3">
						{links.map((link) => (
							<LinkCard key={link.id} link={link} onUpdate={updateLink} onDelete={deleteLink} />
						))}
						{links.length === 0 && (
							<div className="py-12 text-center border border-dashed border-border/40 rounded-xl bg-card/10">
								<p className="text-muted-foreground/60 text-sm normal-case font-medium">
									No links added yet.
								</p>
							</div>
						)}
					</div>
				</SortableContext>
			</DndContext>

			<div className="mt-4 pt-6 border-t border-border/40">
				<div className="flex items-center gap-3 mb-4">
					<h3 className="text-sm font-medium text-foreground normal-case">Add New Link</h3>
					<kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-muted/50 border border-border/50 rounded flex items-center gap-1">
						<span className="text-xs leading-none">⌘</span>K
					</kbd>
				</div>
				<LinkForm onLinkAdded={addLink} />
			</div>
		</div>
	);
}
