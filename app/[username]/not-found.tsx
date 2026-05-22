import Link from 'next/link';
import { IconUserOff } from '@tabler/icons-react';

export default function ProfileNotFound() {
	return (
		<div className="min-h-dvh flex flex-col items-center justify-center w-full bg-background px-4 text-center">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
				<IconUserOff className="h-10 w-10 text-muted-foreground" />
			</div>
			<h2 className="text-3xl font-bold tracking-tight mb-2">Profile Not Found</h2>
			<p className="text-muted-foreground max-w-sm mb-8 font-mono text-sm">
				The user profile you are looking for doesn't exist or has been removed.
			</p>
			<Link
				href="/"
				className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:scale-105 transition-transform"
			>
				Return to Endpoint
			</Link>
		</div>
	);
}
