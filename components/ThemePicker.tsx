"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconCheck, IconPalette } from "@tabler/icons-react";

interface ThemePickerProps {
  currentBackground: string;
  onBackgroundChange: (bg: string) => void;
}

const BACKGROUND_PRESETS = [
  { id: "aurora", name: "Aurora", style: { background: "linear-gradient(135deg, rgba(80, 20, 147, 0.4), transparent, rgba(0, 155, 155, 0.4))" } },
  { id: "grid", name: "Grid", style: { backgroundImage: 'linear-gradient(to right, #ffffff15 1px, transparent 1px), linear-gradient(to bottom, #ffffff15 1px, transparent 1px)', backgroundSize: '1rem 1rem' } },
  { id: "dots", name: "Dots", style: { backgroundImage: 'radial-gradient(#ffffff25 1px, transparent 1px)', backgroundSize: '1rem 1rem' } },
  { id: "solid:#0a0a0a", name: "Solid Dark", style: { background: "#0a0a0a" } },
  { id: "gradient:linear-gradient(135deg,#09203F,#537895)", name: "Deep Space", style: { background: "linear-gradient(135deg, #09203F, #537895)" } },
  { id: "gradient:linear-gradient(to right,#434343, #000000)", name: "Carbon", style: { background: "linear-gradient(to right, #434343, #000000)" } },
] as const;

export function ThemePicker({ currentBackground, onBackgroundChange }: ThemePickerProps) {
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (value: string) => {
    setSaving(true);
    
    // Optimistic UI
    onBackgroundChange(value);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: value }),
      });
      if (!res.ok) throw new Error("Sync failed");
    } catch {
      toast.error("Failed to update design.");
    } finally {
      setSaving(false);
    }
  };

  const isCustomColor = currentBackground?.startsWith("#");

  return (
    <div className="flex flex-col gap-12">
      {/* Background Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Background Style</span>
          {saving && (
            <span className="text-[10px] uppercase font-mono tracking-widest text-foreground animate-pulse">Syncing</span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {BACKGROUND_PRESETS.map((preset) => {
            const isActive = currentBackground === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleUpdate(preset.id)}
                className={`group flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
                  isActive ? "border-foreground bg-foreground/5 shadow-md" : "border-border/60 hover:border-foreground/40 bg-card/20"
                }`}
              >
                <div 
                  className={`w-full aspect-square rounded-lg border border-border/40 relative flex items-center justify-center overflow-hidden bg-[#0a0a0a]`}
                  style={preset.style}
                >
                  {isActive && (
                    <div className="absolute top-1 right-1 bg-foreground text-background rounded-full p-0.5 shadow-sm">
                      <IconCheck size={10} stroke={3} />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors uppercase">
                  {preset.name}
                </div>
              </button>
            );
          })}

          {/* Custom Color Selector */}
          <label
            className={`cursor-pointer group flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
              isCustomColor ? "border-foreground bg-foreground/5 shadow-md" : "border-border/60 hover:border-foreground/40 bg-card/20"
            }`}
          >
            <div 
              className="w-full aspect-square rounded-lg border border-border/40 relative flex items-center justify-center overflow-hidden bg-[#0a0a0a] transition-colors"
              style={{ backgroundColor: isCustomColor ? currentBackground : undefined }}
            >
              <input 
                type="color" 
                value={isCustomColor ? currentBackground : "#000000"}
                onChange={(e) => handleUpdate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              {!isCustomColor && <IconPalette size={20} className="text-muted-foreground group-hover:text-foreground opacity-50" />}
              {isCustomColor && (
                <div className="absolute top-1 right-1 bg-foreground text-background rounded-full p-0.5 shadow-sm">
                  <IconCheck size={10} stroke={3} />
                </div>
              )}
            </div>
            <div className="text-[10px] font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors uppercase">
               Custom Color
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
