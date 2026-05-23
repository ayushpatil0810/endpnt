import type { Link } from '@/db/schema/schema';
import { IconArrowUpRight } from '@tabler/icons-react';
import { LinkIcon } from '@/components/LinkIcon';
import { LinkClickTracker } from '@/components/LinkClickTracker';

interface PublicLinkButtonProps {
	link: Link;
	themeId?: string;
}

/**
 * Public-facing link card button.
 *
 * Horizontal header layout: Favicon and title are inline, link below the title.
 * This reduces card height and improves information density.
 */
export function PublicLinkButton({ link, themeId: _themeId }: PublicLinkButtonProps) {
	return (
		<a
			href={link.url}
			target="_blank"
			rel="noopener noreferrer"
			className="theme-card group relative flex flex-col justify-center w-full p-4 sm:p-5 transition-all duration-300 text-left min-h-[auto] cursor-pointer"
			style={{
				background: 'var(--theme-card-bg)',
				border: 'var(--theme-card-border)',
				boxShadow: 'var(--theme-card-shadow)',
				borderRadius: 'var(--theme-card-radius)',
				backdropFilter: 'var(--theme-card-backdrop)',
				WebkitBackdropFilter: 'var(--theme-card-backdrop)',
			}}
		>
			<LinkClickTracker linkId={link.id} />
			<div className="flex items-center justify-between w-full z-10 pointer-events-none gap-3">
				<div className="flex items-center gap-3 overflow-hidden">
					<div
						className="size-10 rounded-full flex shrink-0 items-center justify-center shadow-sm transition-colors"
						style={{
							background: 'var(--theme-tag-bg)',
							color: 'var(--theme-tag-text, var(--theme-text-primary))',
						}}
					>
						<LinkIcon title={link.title} url={link.url} className="text-inherit size-4" />
					</div>
					<div className="flex flex-col overflow-hidden">
						<span
							className="text-sm sm:text-base font-semibold tracking-tight truncate w-full"
							style={{ color: 'var(--theme-text-primary)' }}
						>
							{link.title}
						</span>
						<span
							className="text-[11px] sm:text-xs truncate w-full font-mono mt-0.5"
							style={{ color: 'var(--theme-text-secondary)' }}
						>
							{link.url.replace(/^https?:\/\//, '')}
						</span>
					</div>
				</div>
				<IconArrowUpRight
					size={18}
					stroke={1.5}
					className="shrink-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					style={{ color: 'var(--theme-text-secondary)' }}
				/>
			</div>
		</a>
	);
}
