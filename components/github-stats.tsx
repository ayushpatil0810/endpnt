import { IconBrandGithub } from "@tabler/icons-react";

export async function GithubStats({ username }: { username: string }) {
  if (!username) return null;

  let data;
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, { next: { revalidate: 3600 } });
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
            <span className="text-sm font-semibold text-foreground tracking-tight">GitHub</span>
            <span className="text-[10px] text-muted-foreground font-mono">@{data.login}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20">
            <span className="text-lg font-bold text-foreground">{data.public_repos || 0}</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Repos</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20">
            <span className="text-lg font-bold text-foreground">{data.followers || 0}</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20">
            <span className="text-lg font-bold text-foreground">{data.following || 0}</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Following</span>
          </div>
        </div>
      </a>
    );
}
