import {
  IconHeart,
  IconMessageCircle,
  IconClock,
  IconArrowUpRight,
} from "@tabler/icons-react";

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

const DEVTO_COLOR = "#7C3AED";
const DEVTO_BG = "rgba(124, 58, 237, 0.08)";
const DEVTO_BORDER = "rgba(124, 58, 237, 0.22)";
const DEVTO_HOVER_BORDER = "rgba(124, 58, 237, 0.55)";

const DevToIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
  </svg>
);

export async function DevtoPosts({ username }: { username: string }) {
  if (!username) return null;

  let articles: DevToArticle[] = [];
  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${username}&per_page=3`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return null;
    articles = await res.json();
    if (!articles || articles.length === 0) return null;
  } catch {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 w-full mb-8">
      <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2">
        <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
          Dev Publications
        </h2>
        <div
          className="flex items-center gap-1.5 text-[9px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ color: DEVTO_COLOR, background: DEVTO_BG }}
        >
          <DevToIcon />
          Dev.to
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={
              {
                background: DEVTO_BG,
                borderColor: DEVTO_BORDER,
                "--hb": DEVTO_HOVER_BORDER,
              } as React.CSSProperties
            }
            className="group relative flex flex-col gap-3 p-5 rounded-none border transition-all duration-300 backdrop-blur-md overflow-hidden hover:border-[var(--hb)] hover:-translate-y-0.5 hover:shadow-lg"
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{ background: DEVTO_COLOR }}
            />

            {/* Badge + arrow */}
            <div className="flex items-center justify-between z-10">
              <div
                className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ color: DEVTO_COLOR, background: `${DEVTO_COLOR}18` }}
              >
                <DevToIcon />
                Dev.to
              </div>
              <IconArrowUpRight
                size={15}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: DEVTO_COLOR }}
              />
            </div>

            {/* Title & description */}
            <div className="flex flex-col gap-1.5 z-10">
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {article.tag_list && article.tag_list.length > 0 && (
              <div className="flex flex-wrap gap-1.5 z-10">
                {article.tag_list.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{
                      color: DEVTO_COLOR,
                      background: `${DEVTO_COLOR}14`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/50 mt-auto z-10 pt-2 border-t border-border/20">
              <span className="flex items-center gap-1.5">
                <IconHeart
                  size={11}
                  className="group-hover:text-rose-400 transition-colors"
                />
                {article.public_reactions_count}
              </span>
              <span className="flex items-center gap-1.5">
                <IconMessageCircle
                  size={11}
                  className="group-hover:text-sky-400 transition-colors"
                />
                {article.comments_count}
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <IconClock size={11} />
                {article.reading_time_minutes} min read
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
