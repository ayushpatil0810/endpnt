import type { ThemeDefinition } from "@/lib/themes";
import { RADIUS_MAP } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ThemedCardProps {
  theme: ThemeDefinition;
  className?: string;
  children: React.ReactNode;
}

/**
 * The single themed surface primitive used across the entire public profile.
 *
 * Reads CSS variables that the page root injects via `style={}`, which means
 * each theme only needs to define its token set in one place (`lib/themes.ts`).
 * Components never need to know which theme is active — they just use
 * `var(--theme-*)` tokens.
 */
export function ThemedCard({ theme, className, children }: ThemedCardProps) {
  return (
    <div
      className={cn("transition-all duration-300", className)}
      style={{
        background: "var(--theme-card-bg)",
        border: "var(--theme-card-border)",
        boxShadow: "var(--theme-card-shadow)",
        borderRadius: RADIUS_MAP[theme.id] ?? "1rem",
        backdropFilter: "var(--theme-card-backdrop)",
        WebkitBackdropFilter: "var(--theme-card-backdrop)",
      }}
    >
      {children}
    </div>
  );
}
