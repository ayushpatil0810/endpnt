import { fetchMediumPosts, fetchHashnodePosts, type BlogPost } from '@/lib/blogs';
import { IconClock, IconArrowUpRight } from '@tabler/icons-react';

interface BlogPostsProps {
	mediumUsername?: string;
	hashnodeUsername?: string;
}

const PLATFORM_CONFIG = {
	medium: {
		label: 'Medium',
		color: '#00ab6c',
		bg: 'rgba(0, 171, 108, 0.08)',
		border: 'rgba(0, 171, 108, 0.22)',
		hoverBorder: 'rgba(0, 171, 108, 0.55)',
		icon: (
			<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
				<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
			</svg>
		),
	},
	hashnode: {
		label: 'Hashnode',
		color: '#2962FF',
		bg: 'rgba(41, 98, 255, 0.08)',
		border: 'rgba(41, 98, 255, 0.22)',
		hoverBorder: 'rgba(41, 98, 255, 0.55)',
		icon: (
			<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
				<path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 00-7.962 0l-6.37 6.37a5.63 5.63 0 000 7.962l6.37 6.37a5.63 5.63 0 007.962 0l6.37-6.37a5.63 5.63 0 000-7.962zM12 15.953a3.953 3.953 0 110-7.906 3.953 3.953 0 010 7.906z" />
			</svg>
		),
	},
};

type PlatformConfig = typeof PLATFORM_CONFIG.medium;

function BlogCard({ post, config }: { post: BlogPost; config: PlatformConfig }) {
	return (
		<a
			href={post.url}
			target="_blank"
			rel="noopener noreferrer"
			// CSS variable trick: set --hb (hover border) in inline style, consume with hover:border-[var(--hb)]
			style={
				{
					background: config.bg,
					borderColor: config.border,
					'--hb': config.hoverBorder,
				} as React.CSSProperties
			}
			className="group relative flex flex-col gap-3 p-5 rounded-none border transition-all duration-300 backdrop-blur-md overflow-hidden hover:border-[var(--hb)] hover:-translate-y-0.5 hover:shadow-lg"
		>
			{/* Ambient glow blob */}
			<div
				className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500"
				style={{ background: config.color }}
			/>

			{/* Platform badge + arrow */}
			<div className="flex items-center justify-between z-10">
				<div
					className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase"
					style={{ color: config.color, background: `${config.color}18` }}
				>
					<span style={{ color: config.color }}>{config.icon}</span>
					{config.label}
				</div>
				<IconArrowUpRight
					size={15}
					className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
					style={{ color: config.color }}
				/>
			</div>

			{/* Content */}
			<div className="flex flex-col gap-1.5 z-10">
				<h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
					{post.title}
				</h3>
				{post.description && (
					<p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
						{post.description}
					</p>
				)}
			</div>

			{post.publishedAt && (
				<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/50 mt-auto z-10">
					<IconClock size={11} />
					{new Date(post.publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					})}
				</div>
			)}
		</a>
	);
}

export async function BlogPosts({ mediumUsername, hashnodeUsername }: BlogPostsProps) {
	if (!mediumUsername && !hashnodeUsername) return null;

	const [mediumPosts, hashnodePosts] = await Promise.all([
		mediumUsername ? fetchMediumPosts(mediumUsername) : Promise.resolve([]),
		hashnodeUsername ? fetchHashnodePosts(hashnodeUsername) : Promise.resolve([]),
	]);

	const hasMedium = mediumPosts.length > 0;
	const hasHashnode = hashnodePosts.length > 0;

	if (!hasMedium && !hasHashnode) return null;

	const bothPlatforms = hasMedium && hasHashnode;

	return (
		<section className="flex flex-col gap-4 w-full mb-8">
			{/* Section header — matches original border-b style, badges appended when both platforms */}
			<div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2">
				<h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
					Latest Articles
				</h2>
				{bothPlatforms && (
					<div className="flex items-center gap-2">
						<span
							className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest"
							style={{ color: PLATFORM_CONFIG.medium.color, background: PLATFORM_CONFIG.medium.bg }}
						>
							{PLATFORM_CONFIG.medium.icon} Med
						</span>
						<span
							className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest"
							style={{
								color: PLATFORM_CONFIG.hashnode.color,
								background: PLATFORM_CONFIG.hashnode.bg,
							}}
						>
							{PLATFORM_CONFIG.hashnode.icon} Hashnode
						</span>
					</div>
				)}
			</div>

			{bothPlatforms ? (
				// Side-by-side when both platforms present
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex flex-col gap-3">
						<div
							className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full self-start"
							style={{ color: PLATFORM_CONFIG.medium.color, background: PLATFORM_CONFIG.medium.bg }}
						>
							{PLATFORM_CONFIG.medium.icon} Medium
						</div>
						{mediumPosts.slice(0, 3).map((post, idx) => (
							<BlogCard key={`medium-${idx}`} post={post} config={PLATFORM_CONFIG.medium} />
						))}
					</div>

					<div className="flex flex-col gap-3">
						<div
							className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full self-start"
							style={{
								color: PLATFORM_CONFIG.hashnode.color,
								background: PLATFORM_CONFIG.hashnode.bg,
							}}
						>
							{PLATFORM_CONFIG.hashnode.icon} Hashnode
						</div>
						{hashnodePosts.slice(0, 3).map((post, idx) => (
							<BlogCard key={`hashnode-${idx}`} post={post} config={PLATFORM_CONFIG.hashnode} />
						))}
					</div>
				</div>
			) : (
				// Single platform
				<div className="grid grid-cols-1 gap-3">
					{(hasMedium ? mediumPosts : hashnodePosts).slice(0, 4).map((post, idx) => (
						<BlogCard
							key={`post-${idx}`}
							post={post}
							config={hasMedium ? PLATFORM_CONFIG.medium : PLATFORM_CONFIG.hashnode}
						/>
					))}
				</div>
			)}
		</section>
	);
}
