interface SeoTabProps {
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  handleSeoSave: () => void;
}

export function SeoTab({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  handleSeoSave,
}: SeoTabProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">SEO & Social Sharing</h2>
      <div className="flex flex-col gap-5 max-w-xl">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">Meta Title</label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="e.g. John Doe - Full-stack Engineer" className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">Meta Description</label>
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="e.g. Check out my latest articles and source code." className="w-full min-h-32 resize-none bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
        </div>
        <div className="mt-2">
          <button onClick={handleSeoSave} className="bg-foreground text-background px-6 py-2.5 rounded-md text-[10px] uppercase tracking-widest font-medium transition-colors hover:bg-foreground/90">
            Save SEO Settings
          </button>
        </div>
      </div>
    </div>
  );
}
