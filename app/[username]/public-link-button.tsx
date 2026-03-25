"use client";

import type { Link } from "@/db/schema/schema";
import { IconArrowUpRight } from "@tabler/icons-react";
import { LinkIcon } from "@/components/LinkIcon";

interface PublicLinkButtonProps {
  link: Link;
}

export function PublicLinkButton({ link }: PublicLinkButtonProps) {
  async function handleClick() {
    fetch(`/api/links/${link.id}/click`, { method: "POST" }).catch(() => {});
    window.open(link.url, "_blank", "noopener,noreferrer");
  }

  return (
    <button 
      onClick={handleClick} 
      className="group flex items-center justify-between w-full px-8 py-5 sm:py-6 bg-card/5 hover:bg-card/30 border border-border/50 hover:border-foreground/40 transition-all duration-500 text-left rounded-2xl backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4">
        <LinkIcon title={link.title} url={link.url} className="text-foreground/90 group-hover:text-foreground transition-colors" />
        <span className="text-base sm:text-lg font-medium tracking-tight group-hover:text-foreground text-foreground/90 transition-colors uppercase">
          {link.title}
        </span>
      </div>
      <IconArrowUpRight size={20} stroke={1.5} className="text-muted-foreground/50 group-hover:text-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
    </button>
  );
}
