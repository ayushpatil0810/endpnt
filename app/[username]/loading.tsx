import { IconLoader2 } from "@tabler/icons-react";

export default function ProfileLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center w-full bg-background">
      <div className="flex flex-col items-center gap-4">
        <IconLoader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">Loading profile...</p>
      </div>
    </div>
  );
}
