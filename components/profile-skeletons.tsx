function Bone({ className = '' }: { className?: string }) {
	return <div className={`animate-pulse rounded-none bg-foreground/[0.07] ${className}`} />;
}

export function GithubStatsSkeleton() {
	return (
		<div className="w-full p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md flex flex-col gap-4">
			{/* Icon + label */}
			<div className="flex items-center gap-3">
				<Bone className="size-6 rounded-none" />
				<div className="flex flex-col gap-1.5">
					<Bone className="h-3 w-14" />
					<Bone className="h-2.5 w-20" />
				</div>
			</div>
			{/* 3 stat boxes */}
			<div className="grid grid-cols-3 gap-2 mt-2">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20 gap-2"
					>
						<Bone className="h-5 w-8" />
						<Bone className="h-2 w-10" />
					</div>
				))}
			</div>
		</div>
	);
}

export function GithubCalendarSkeleton() {
	return (
		<div className="w-full p-5 sm:p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md">
			{/* Label */}
			<Bone className="h-2.5 w-28 mb-4" />
			{/* Calendar grid approximation */}
			<div className="flex flex-col gap-1.5">
				{[...Array(7)].map((_, row) => (
					<div key={row} className="flex gap-1">
						{[...Array(26)].map((_, col) => (
							<div
								key={col}
								className="animate-pulse rounded-none bg-foreground/[0.07]"
								style={{ width: 14, height: 14 }}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export function LeetcodeStatsSkeleton() {
	return (
		<div className="w-full p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
			{/* Glow placeholder */}
			<div className="absolute -top-10 -right-10 w-32 h-32 bg-foreground/[0.03] blur-3xl rounded-full pointer-events-none" />
			{/* Icon + label */}
			<div className="flex items-center gap-3 z-10">
				<Bone className="size-6 rounded-none" />
				<div className="flex flex-col gap-1.5">
					<Bone className="h-3 w-16" />
					<Bone className="h-2.5 w-20" />
				</div>
			</div>
			{/* 3 stat boxes */}
			<div className="grid grid-cols-3 gap-2 mt-2 z-10">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20 gap-2"
					>
						<Bone className="h-5 w-8" />
						<Bone className="h-2 w-10" />
					</div>
				))}
			</div>
		</div>
	);
}

export function FeaturedProjectsSkeleton() {
	return (
		<div className="flex flex-col gap-4 w-full mb-8">
			{/* Section header */}
			<div className="border-b border-border/40 pb-2">
				<Bone className="h-2.5 w-32" />
			</div>
			{/* 2 Project Cards */}
			<div className="grid grid-cols-1 gap-3">
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className="flex flex-col gap-3 p-5 sm:p-6 rounded-none border border-border/30 bg-foreground/[0.03] backdrop-blur-md"
					>
						{/* Title row */}
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3 w-full">
								<Bone className="size-8 rounded-none shrink-0" />
								<Bone className="h-4 w-40" />
							</div>
							<div className="flex gap-2">
								<Bone className="h-6 w-14 rounded-none" />
								<Bone className="h-6 w-16 rounded-none" />
							</div>
						</div>
						{/* Description */}
						<div className="pl-11 flex flex-col gap-1.5 mt-1">
							<Bone className="h-2.5 w-full" />
							<Bone className="h-2.5 w-3/4" />
						</div>
						{/* Tech chips */}
						<div className="pl-11 flex gap-2 mt-2">
							<Bone className="h-5 w-16 rounded-full" />
							<Bone className="h-5 w-12 rounded-full" />
							<Bone className="h-5 w-20 rounded-full" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function ArticleCardSkeleton() {
	return (
		<div className="flex flex-col gap-3 p-5 rounded-none border border-border/30 bg-foreground/[0.03] backdrop-blur-md">
			{/* Platform badge */}
			<Bone className="h-5 w-20 rounded-full" />
			{/* Title */}
			<div className="flex flex-col gap-1.5">
				<Bone className="h-3.5 w-full" />
				<Bone className="h-3.5 w-4/5" />
			</div>
			{/* Description */}
			<div className="flex flex-col gap-1">
				<Bone className="h-2.5 w-full" />
				<Bone className="h-2.5 w-3/4" />
			</div>
			{/* Meta */}
			<Bone className="h-2.5 w-24 mt-1" />
		</div>
	);
}

export function DevtoPostsSkeleton() {
	return (
		<div className="flex flex-col gap-4 w-full mb-8">
			{/* Section header */}
			<div className="flex items-center justify-between border-b border-border/40 pb-2">
				<Bone className="h-2.5 w-28" />
				<Bone className="h-5 w-14 rounded-full" />
			</div>
			{/* 3 article cards */}
			<div className="grid grid-cols-1 gap-3">
				<ArticleCardSkeleton />
				<ArticleCardSkeleton />
				<ArticleCardSkeleton />
			</div>
		</div>
	);
}

export function BlogPostsSkeleton() {
	return (
		<div className="flex flex-col gap-4 w-full mb-8">
			{/* Section header */}
			<div className="flex items-center justify-between border-b border-border/40 pb-2">
				<Bone className="h-2.5 w-28" />
				<div className="flex gap-2">
					<Bone className="h-5 w-12 rounded-full" />
					<Bone className="h-5 w-16 rounded-full" />
				</div>
			</div>
			{/* Two-column layout (mirrors the both-platforms grid) */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="flex flex-col gap-3">
					<Bone className="h-5 w-20 rounded-full" />
					<ArticleCardSkeleton />
					<ArticleCardSkeleton />
				</div>
				<div className="flex flex-col gap-3">
					<Bone className="h-5 w-24 rounded-full" />
					<ArticleCardSkeleton />
					<ArticleCardSkeleton />
				</div>
			</div>
		</div>
	);
}
