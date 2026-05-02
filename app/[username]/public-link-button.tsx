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
      className="group flex flex-col justify-between w-full h-full p-5 sm:p-6 bg-card/10 hover:bg-card/30 border border-border/40 hover:border-foreground/40 transition-all duration-300 text-left rounded-3xl backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-1 min-h-[160px]"
    >
      <div className="flex items-start justify-between w-full">
         <div className="size-12 rounded-full bg-foreground/10 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors shadow-sm">
            <LinkIcon title={link.title} url={link.url} className="text-inherit size-5" />
         </div>
         <IconArrowUpRight size={20} stroke={1.5} className="text-muted-foreground/50 group-hover:text-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
      <div className="mt-6 flex flex-col gap-1 w-full">
         <span className="text-base sm:text-lg font-semibold tracking-tight group-hover:text-foreground text-foreground/90 transition-colors truncate w-full">
           {link.title}
         </span>
         <span className="text-[11px] text-muted-foreground truncate w-full font-mono">
           {link.url.replace(/^https?:\/\//, '')}
         </span>
      </div>
    </button>
  );
}
