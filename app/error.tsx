'use client';

import { useEffect } from 'react';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Global Error:', error);
	}, [error]);

	return (
		<div className="flex h-[100dvh] w-full flex-col items-center justify-center space-y-4 bg-background text-foreground">
			<div className="space-y-2 text-center">
				<h1 className="text-4xl font-bold tracking-tighter">Something went wrong</h1>
				<p className="text-muted-foreground">We encountered an unexpected error.</p>
			</div>
			<button
				onClick={() => reset()}
				className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
			>
				Try again
			</button>
		</div>
	);
}
