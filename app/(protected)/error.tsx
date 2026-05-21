"use client";

import { useEffect } from "react";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-border bg-card p-8 text-center animate-in fade-in-50">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Oops, something went wrong here</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          An error occurred while loading this section of the dashboard. Your data is safe.
        </p>
      </div>
      <button 
        onClick={() => reset()} 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
      >
        Try again
      </button>
    </div>
  );
}
