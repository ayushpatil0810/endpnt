export default function ProtectedLoading() {
	return (
		<div className="flex h-full min-h-[50vh] w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-sm"></div>
				<p className="text-sm font-medium text-muted-foreground animate-pulse">
					Loading dashboard...
				</p>
			</div>
		</div>
	);
}
