import { IconBrandGithub } from "@tabler/icons-react";

const formatNumber = (num: number) => 
  Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num || 0);

export async function GithubStats({ username }: { username: string }) {
  if (!username) return null;

  let data;
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    data = await res.json();
  } catch {
    return null;
  }

  return (
    <a
      href={`https://github.com/${data.login}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md flex flex-col gap-4 group hover:border-foreground/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <IconBrandGithub size={24} className="text-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            GitHub
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            @{data.login}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/10 w-full">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Repos
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatNumber(data.public_repos || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Followers
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatNumber(data.followers || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Following
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatNumber(data.following || 0)}
          </span>
        </div>
      </div>
    </a>
  );
}
