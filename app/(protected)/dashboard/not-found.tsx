import Link from 'next/link';

export default function DashboardNotFound() {
	return (
		<div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4">
			<h2 className="text-2xl font-bold tracking-tight">Not Found</h2>
			<p className="text-muted-foreground">Could not find requested resource in the dashboard.</p>
			<Link href="/" className="text-sm font-medium hover:underline text-foreground">
				Return Home
			</Link>
		</div>
	);
}
