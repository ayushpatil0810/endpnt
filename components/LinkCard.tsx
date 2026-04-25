import { useState } from "react";
import { LinkIcon } from "./LinkIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconGripVertical,
  IconCheck,
  IconX,
  IconLoader2,
  IconExternalLink,
  IconPointer,
} from "@tabler/icons-react";
import { toast } from "sonner";
import type { Link } from "@/db/schema/schema";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: Link;
  onUpdate: (updated: Link) => void;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onUpdate, onDelete }: LinkCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  async function save() {
    if (!title.trim() || !url.trim()) return;
    setSaving(true);
    try {
      const normalizedUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;

      const optimisticLink = { ...link, title: title.trim(), url: normalizedUrl };
      onUpdate(optimisticLink);
      setEditing(false);

      const res = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), url: normalizedUrl }),
      });

      if (!res.ok) throw new Error("Failed");
      const updated: Link = await res.json();
      onUpdate(updated);
      toast.success("Link updated!");
    } catch {
      onUpdate(link);
      setEditing(true);
      toast.error("Failed to update link.");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setTitle(link.title);
    setUrl(link.url);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    onDelete(link.id);
    try {
      const res = await fetch(`/api/links/${link.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Link deleted.");
    } catch {
      toast.error("Failed to delete link. Please refresh the page.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center gap-6 py-6 border-b border-border/50 transition-all duration-300",
        isDragging && "scale-[1.02] border-foreground shadow-2xl bg-card"
      )}
    >
      <div className="flex items-center gap-6 w-full">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none transition-all touch-none py-2 rounded-md"
          aria-label="Reorder"
        >
          <IconGripVertical size={20} stroke={1.5} />
        </button>

        {/* Content */}
        <div className="flex-1 w-full min-w-0 pr-4">
          {editing ? (
            <div className="flex flex-col gap-4 w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="bg-transparent border-b border-border focus:border-foreground py-2 text-lg font-medium tracking-tight text-foreground focus:outline-none transition-all placeholder:text-muted-foreground rounded-none w-full normal-case"
                autoFocus
              />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="bg-transparent border-b border-border focus:border-foreground py-2 text-sm font-mono tracking-widest text-muted-foreground focus:outline-none transition-all placeholder:text-muted-foreground rounded-none w-full normal-case"
              />
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium bg-foreground text-background px-6 py-2.5 hover:bg-muted-foreground disabled:opacity-50 transition-colors"
                >
                  {saving ? <IconLoader2 size={12} className="animate-spin" /> : <IconCheck size={12} />}
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground px-4 py-2.5 transition-colors border border-transparent hover:border-border"
                >
                  <IconX size={12} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full relative">
              <div className="flex flex-row items-center gap-4">
                <LinkIcon title={link.title} url={link.url} className="text-foreground" />
                <div className="font-medium text-lg sm:text-xl tracking-tight text-foreground truncate group-hover:text-primary transition-colors normal-case">
                  {link.title}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors truncate flex items-center gap-1.5 normal-case"
                >
                  <IconExternalLink size={12} />
                  {link.url}
                </a>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 normal-case">
                  <IconPointer size={12} />
                  <span>{link.clicks} clicks</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!editing && (
          <div className="flex items-center gap-2 sm:gap-4 opacity-100 lg:opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity duration-300 ml-auto mr-0 sm:mr-4 flex-col sm:flex-row">
            <button
              onClick={() => setEditing(true)}
              className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 hover:bg-muted"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground hover:text-destructive transition-colors border border-border px-3 py-1.5 hover:bg-destructive/10 disabled:opacity-50"
            >
              {deleting ? (
                <IconLoader2 size={12} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
