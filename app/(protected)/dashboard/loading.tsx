import { IconLoader2 } from "@tabler/icons-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
