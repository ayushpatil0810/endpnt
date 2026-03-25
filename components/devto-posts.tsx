import { IconArticle, IconHeart, IconMessageCircle, IconClock } from "@tabler/icons-react";

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  public_reactions_count: number;
  comments_count: number;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
}

export async function DevtoPosts({ username }: { username: string }) {
  if (!username) return null;

  try {
    const res = await fetch(`https://dev.to/api/articles?username=${username}&per_page=3`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) return null;
    const articles: DevToArticle[] = await res.json();
    
    if (!articles || articles.length === 0) return null;

    return (
      <div className="flex flex-col gap-4 w-full mb-8">
        <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2">
          Latest Publications
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 p-5 sm:p-6 rounded-2xl bg-card/5 hover:bg-card/20 border border-border/40 hover:border-foreground/40 transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base sm:text-lg font-medium tracking-tight text-foreground/90 group-hover:text-foreground transition-colors normal-case leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground/80 line-clamp-2 normal-case leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/60 mt-2">
                <span className="flex items-center gap-1.5">
                  <IconHeart size={14} className="group-hover:text-rose-500 transition-colors" />
                  {article.public_reactions_count}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconMessageCircle size={14} className="group-hover:text-blue-400 transition-colors" />
                  {article.comments_count}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconClock size={14} className="text-muted-foreground/40" />
                  {article.reading_time_minutes} min read
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}
