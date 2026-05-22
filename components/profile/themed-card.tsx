import type { ThemeDefinition } from '@/lib/themes';
import { cn } from '@/lib/utils';

interface ThemedCardProps {
	theme?: ThemeDefinition;
	className?: string;
	children: React.ReactNode;
}

/**
 * The single themed surface primitive used across the public profile.
 *
 * All visual tokens are read from CSS custom properties injected into the
 * document by ThemeStyleInjector — not inline style props.
 * `theme` is accepted but unused; it's kept in the signature so callers
 * don't need to change their JSX while we migrate.
 */
export function ThemedCard({ theme: _theme, className, children }: ThemedCardProps) {
	return (
		<div
			className={cn('transition-all duration-300', className)}
			style={{
				background: 'var(--theme-card-bg)',
				border: 'var(--theme-card-border)',
				boxShadow: 'var(--theme-card-shadow)',
				borderRadius: 'var(--theme-card-radius)',
				backdropFilter: 'var(--theme-card-backdrop)',
				WebkitBackdropFilter: 'var(--theme-card-backdrop)',
			}}
		>
			{children}
		</div>
	);
}
