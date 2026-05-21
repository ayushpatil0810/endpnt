"use client";

import { useEffect } from "react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center space-y-4 bg-background text-foreground px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Authentication Error</h1>
        <p className="text-muted-foreground">We had trouble signing you in or setting up your session.</p>
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
