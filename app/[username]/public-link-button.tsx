"use client";

import type { Link } from "@/db/schema/schema";
import { IconArrowUpRight } from "@tabler/icons-react";
import { LinkIcon } from "@/components/LinkIcon";

interface PublicLinkButtonProps {
  link: Link;
  themeId?: string;
}

const RADIUS_MAP: Record<string, string> = {
  glassmorphism: "1.5rem",
  "neo-brutalism": "0px",
  neumorphism: "1.25rem",
  claymorphism: "2rem",
};

export function PublicLinkButton({ link, themeId = "glassmorphism" }: PublicLinkButtonProps) {
  async function handleClick() {
    fetch(`/api/links/${link.id}/click`, { method: "POST" }).catch(() => {});
    window.open(link.url, "_blank", "noopener,noreferrer");
  }

  const borderRadius = RADIUS_MAP[themeId] ?? "1.5rem";

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col justify-between w-full h-full p-5 sm:p-6 transition-all duration-300 text-left min-h-[160px]"
      style={{
        background: "var(--theme-card-bg)",
        border: "var(--theme-card-border)",
        boxShadow: "var(--theme-card-shadow)",
        borderRadius,
        backdropFilter: "var(--theme-card-backdrop)",
        WebkitBackdropFilter: "var(--theme-card-backdrop)",
      }}
    >
      <div className="flex items-start justify-between w-full">
        <div
          className="size-12 rounded-full flex items-center justify-center shadow-sm transition-colors"
          style={{
            background: "var(--theme-tag-bg)",
            color: "var(--theme-tag-text, var(--theme-text-primary))",
          }}
        >
          <LinkIcon title={link.title} url={link.url} className="text-inherit size-5" />
        </div>
        <IconArrowUpRight
          size={20}
          stroke={1.5}
          className="transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
          style={{ color: "var(--theme-text-secondary)" }}
        />
      </div>
      <div className="mt-6 flex flex-col gap-1 w-full">
        <span
          className="text-base sm:text-lg font-semibold tracking-tight truncate w-full"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {link.title}
        </span>
        <span
          className="text-[11px] truncate w-full font-mono"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {link.url.replace(/^https?:\/\//, "")}
        </span>
      </div>
    </button>
  );
}
