import { fetchMediumPosts, fetchHashnodePosts, type BlogPost } from "@/lib/blogs";
import { IconArticle, IconBrandMedium, IconClock } from "@tabler/icons-react";

interface BlogPostsProps {
  mediumUsername?: string;
  hashnodeUsername?: string;
}

export async function BlogPosts({ mediumUsername, hashnodeUsername }: BlogPostsProps) {
  if (!mediumUsername && !hashnodeUsername) return null;

  const [mediumPosts, hashnodePosts] = await Promise.all([
    mediumUsername ? fetchMediumPosts(mediumUsername) : Promise.resolve([]),
    hashnodeUsername ? fetchHashnodePosts(hashnodeUsername) : Promise.resolve([]),
  ]);

  const allPosts: BlogPost[] = [...mediumPosts, ...hashnodePosts];

  if (allPosts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2">
        Latest Articles
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {allPosts.map((post, idx) => (
          <a
            key={`${post.source}-${idx}`}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-5 sm:p-6 rounded-2xl bg-card/5 hover:bg-card/20 border border-border/40 hover:border-foreground/40 transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
                {post.source === "medium" ? (
                  <IconBrandMedium size={18} />
                ) : (
                  <IconArticle size={18} />
                )}
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <h3 className="text-base sm:text-lg font-medium tracking-tight text-foreground/90 group-hover:text-foreground transition-colors normal-case leading-snug line-clamp-2">
                  {post.title}
                </h3>

                {post.description && (
                  <p className="text-sm text-muted-foreground/80 line-clamp-2 normal-case leading-relaxed">
                    {post.description}
                  </p>
                )}

                {post.publishedAt && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 mt-1">
                    <IconClock size={12} />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
