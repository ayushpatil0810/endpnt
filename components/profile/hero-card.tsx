import Image from "next/image";
import { IconFileText } from "@tabler/icons-react";
import { ThemedCard } from "./themed-card";
import { GithubStatus } from "@/components/GithubStatus";
import type { ThemeDefinition } from "@/lib/themes";
import type { User } from "./types";

interface HeroCardProps {
  user: User;
  theme: ThemeDefinition;
  /** When true, centers all content (used by the Minimal layout). */
  alignCenter?: boolean;
}

/**
 * The profile identity card — avatar, name, handle, bio, resume CTA.
 *
 * Layout alignment is controlled by `alignCenter` so the same card works
 * in both the left-anchored Sidebar layout and the centered Minimal layout.
 */
export function HeroCard({ user, theme, alignCenter = false }: HeroCardProps) {
  const contentAlign = alignCenter
    ? "items-center text-center"
    : "items-center lg:items-start text-center lg:text-left";

  const innerAlign = alignCenter ? "items-center" : "items-center lg:items-start";

  return (
    <ThemedCard
      theme={theme}
      className={`flex flex-col ${contentAlign} justify-between p-8 min-h-[380px] group animate-in fade-in slide-in-from-bottom-8 duration-700 h-full`}
    >
      <div className={`flex flex-col ${innerAlign} gap-6 w-full`}>
        {/* Avatar */}
        <div
          className="size-28 sm:size-32 rounded-full overflow-hidden ring-4 shadow-xl bg-white/10 group-hover:scale-105 transition-transform duration-500 shrink-0"
          style={{
            border:
              theme.id === "neo-brutalism"
                ? "3px solid var(--theme-text-primary)"
                : "2px solid rgba(255,255,255,0.2)",
          }}
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={128}
              height={128}
              className="size-full object-cover"
              priority
            />
          ) : (
            <div
              className="size-full flex items-center justify-center text-4xl font-serif italic"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Identity */}
        <div className={`flex flex-col gap-2 w-full ${innerAlign}`}>
          <h1
            className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight ${
              theme.id === "neo-brutalism" ? "font-mono" : ""
            }`}
            style={{ color: "var(--theme-text-primary)" }}
          >
            {user.username}
          </h1>
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            @{user.username}
          </p>

          {user.bio && (
            <p
              className="text-sm leading-relaxed font-mono mt-3 max-w-sm"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {user.bio}
            </p>
          )}

          {user.githubUsername && (
            <div className={`mt-5 flex ${alignCenter ? "justify-center" : "justify-center lg:justify-start"} w-full`}>
              <GithubStatus username={user.githubUsername} />
            </div>
          )}
        </div>
      </div>

      {/* Resume CTA */}
      {user.resumeUrl && (
        <div className="w-full mt-8">
          <a
            href={user.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold w-full transition-all duration-200 hover:opacity-90"
            style={{
              background: "var(--theme-btn-bg)",
              color: "var(--theme-btn-text)",
              borderRadius:
                theme.id === "neo-brutalism"
                  ? "0"
                  : theme.id === "claymorphism"
                    ? "1rem"
                    : "0.75rem",
              border:
                theme.id === "neo-brutalism"
                  ? "2.5px solid var(--theme-text-primary)"
                  : "none",
              boxShadow:
                theme.id === "neo-brutalism"
                  ? "4px 4px 0px var(--theme-text-primary)"
                  : theme.id === "neumorphism"
                    ? "var(--theme-btn-shadow)"
                    : theme.id === "claymorphism"
                      ? "0 4px 0px #d4b8e0"
                      : "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <IconFileText size={18} />
            View Resume
          </a>
        </div>
      )}
    </ThemedCard>
  );
}
