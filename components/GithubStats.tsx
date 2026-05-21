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
      className="w-full h-full p-6 flex flex-col gap-4 group hover:bg-foreground/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <IconBrandGithub size={24} className="text-inherit" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-inherit tracking-tight">
            GitHub
          </span>
          <span className="text-[10px] font-mono" style={{ color: "var(--theme-text-secondary)" }}>
            @{data.login}
          </span>
        </div>
      </div>
      <div 
        className="flex flex-col gap-3 mt-4 pt-4 border-t w-full"
        style={{ borderColor: "var(--theme-separator)" }}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--theme-text-secondary)" }}>
            Repos
          </span>
          <span className="text-sm font-bold text-inherit">
            {formatNumber(data.public_repos || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--theme-text-secondary)" }}>
            Followers
          </span>
          <span className="text-sm font-bold text-inherit">
            {formatNumber(data.followers || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--theme-text-secondary)" }}>
            Following
          </span>
          <span className="text-sm font-bold text-inherit">
            {formatNumber(data.following || 0)}
          </span>
        </div>
      </div>
    </a>
  );
}
