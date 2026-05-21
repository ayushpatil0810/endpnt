import type { Link } from "@/db/schema/schema";
import { IconArrowUpRight } from "@tabler/icons-react";
import { LinkIcon } from "@/components/LinkIcon";
import { LinkClickTracker } from "@/components/LinkClickTracker";
import { RADIUS_MAP } from "@/lib/themes";

interface PublicLinkButtonProps {
  link: Link;
  themeId?: string;
}

export function PublicLinkButton({ link, themeId = "glassmorphism" }: PublicLinkButtonProps) {
  const borderRadius = RADIUS_MAP[themeId] ?? "1.5rem";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between w-full h-full p-5 sm:p-6 transition-all duration-300 text-left min-h-[160px] cursor-pointer"
      style={{
        background: "var(--theme-card-bg)",
        border: "var(--theme-card-border)",
        boxShadow: "var(--theme-card-shadow)",
        borderRadius,
        backdropFilter: "var(--theme-card-backdrop)",
        WebkitBackdropFilter: "var(--theme-card-backdrop)",
      }}
    >
      <LinkClickTracker linkId={link.id} />
      <div className="flex items-start justify-between w-full z-10 pointer-events-none">
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
      <div className="mt-6 flex flex-col gap-1 w-full z-10 pointer-events-none">
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
    </a>
  );
}
