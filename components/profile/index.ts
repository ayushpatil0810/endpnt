/**
 * Barrel export for the `components/profile` module.
 *
 * Import from here instead of deep individual paths:
 *   import { SidebarLayout, ThemedCard } from "@/components/profile"
 */

// Primitives
export { ThemedCard } from "./themed-card";
export { ThemeBackground } from "./theme-background";
export { ProfileFooter } from "./profile-footer";

// Cards
export { HeroCard } from "./hero-card";
export { ProjectCard } from "./project-card";

// Sections
export { DeveloperStatsSection } from "./sections/developer-stats-section";
export { GithubCalendarSection } from "./sections/github-calendar-section";
export { ProjectsSection } from "./sections/projects-section";
export { ArticlesSection } from "./sections/articles-section";

// Layouts
export { SidebarLayout } from "./layouts/sidebar-layout";
export { BentoLayout } from "./layouts/bento-layout";
export { MinimalLayout } from "./layouts/minimal-layout";

// Types
export type { ProfileLayoutProps } from "./types";
