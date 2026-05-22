import type { ThemeDefinition } from '@/lib/themes';

interface ThemeStyleInjectorProps {
	theme: ThemeDefinition;
}

/**
 * Pure server component — renders a single `<style>` tag that sets all
 * `--theme-*` CSS custom properties on `[data-theme="<id>"]`.
 *
 * Why this matters:
 *   - Tokens live in the stylesheet, not on every inline `style={{}}` prop.
 *   - The browser can cache the stylesheet across navigations.
 *   - DOM payload is smaller (no repeated serialized values per element).
 *   - Components reference `var(--theme-*)` without ever importing the theme object.
 */
export function ThemeStyleInjector({ theme }: ThemeStyleInjectorProps) {
	const vars = Object.entries(theme.cssVars)
		.map(([key, value]) => `  ${key}: ${value};`)
		.join('\n');

	const css = `[data-theme="${theme.id}"] {\n${vars}\n}`;

	return (
		<style
			// Use a stable id so React hydration matches and avoids double-injection
			id={`theme-vars-${theme.id}`}
			// dangerouslySetInnerHTML is safe here — values come from our own
			// controlled THEMES constant, never from user input.
			dangerouslySetInnerHTML={{ __html: css }}
		/>
	);
}
