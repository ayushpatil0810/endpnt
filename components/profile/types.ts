import type { ThemeDefinition } from '@/lib/themes';
import type { User, Link, Project } from '@/db/schema/schema';

/** Re-export DB types for convenience within the profile tree. */
export type { User, Link, Project };

/** Props shared by all three layout components. */
export interface ProfileLayoutProps {
	user: User;
	userLinks: Link[];
	userProjects: Project[];
	theme: ThemeDefinition;
}
