import { IconBrandGithub } from "@tabler/icons-react";

import { getGithubProfile } from "@/lib/github";

const formatNumber = (num: number) => 
  Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num || 0);

export async function GithubStats({ username }: { username: string }) {
  if (!username) return null;

  const profile = await getGithubProfile(username);
  if (!profile) return null;

  return (
    <a
      href={`https://github.com/${profile.username}`}
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
            @{profile.username}
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
            {formatNumber(profile.publicRepos || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--theme-text-secondary)" }}>
            Followers
          </span>
          <span className="text-sm font-bold text-inherit">
            {formatNumber(profile.followers || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--theme-text-secondary)" }}>
            Following
          </span>
          <span className="text-sm font-bold text-inherit">
            {/* Following isn't exposed yet but leaving zero as fallback */}
            {formatNumber(0)}
          </span>
        </div>
      </div>
    </a>
  );
}
