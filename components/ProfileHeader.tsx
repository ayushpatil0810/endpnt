"use client";

import Image from "next/image";
import { useState } from "react";
import { IconCheck, IconX, IconLoader2, IconPencil } from "@tabler/icons-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  onBioUpdate?: (bio: string) => void;
}

export function ProfileHeader({
  username,
  bio,
  avatarUrl,
  onBioUpdate,
}: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [bioValue, setBioValue] = useState(bio ?? "");
  const [saving, setSaving] = useState(false);

  async function saveBio() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bioValue }),
      });
      if (!res.ok) throw new Error("Failed to save");
      onBioUpdate?.(bioValue);
      setEditing(false);
      toast.success("Bio updated!");
    } catch {
      toast.error("Failed to update bio.");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setBioValue(bio ?? "");
    setEditing(false);
  }

  return (
    <div className="flex flex-col sm:flex-row items-start gap-8">
      {/* Avatar */}
      <div className="size-24 rounded-none bg-muted flex-shrink-0 overflow-hidden border border-border">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            width={96}
            height={96}
            className="size-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-4xl font-serif italic text-muted-foreground bg-card">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 w-full flex flex-col items-start min-w-0">
        <div className="flex items-center justify-between w-full">
          <div className="font-medium text-3xl tracking-tight text-foreground uppercase">
            @{username}
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              title="Edit Profile"
            >
              <IconPencil size={18} stroke={1.5} />
            </button>
          )}
        </div>

        {editing ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-4 mt-6 w-full max-w-lg"
          >
            <textarea
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="Add a bio..."
              className="w-full bg-transparent border-b border-border focus:border-foreground py-2 text-sm font-mono text-foreground resize-none focus:outline-none transition-all placeholder:text-muted-foreground/50 normal-case"
              autoFocus
            />
            <div className="flex items-center gap-4">
              <button
                onClick={saveBio}
                disabled={saving}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium bg-foreground text-background px-6 py-2 hover:bg-muted-foreground disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <IconLoader2 size={14} className="animate-spin" />
                ) : (
                  <IconCheck size={14} />
                )}
                Save
              </button>
              <button
                onClick={cancel}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground px-4 py-2 hover:bg-card transition-colors border border-transparent hover:border-border"
              >
                <IconX size={14} />
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-4 text-sm text-foreground/80 font-mono tracking-wide leading-relaxed max-w-xl normal-case">
            {bio || (
              <span className="opacity-50 italic">No bio yet — click edit to add one.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
