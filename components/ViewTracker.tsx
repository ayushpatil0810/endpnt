"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ username }: { username: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // Basic deduplication to ensure React Strict Mode doesn't double-count views locally
    // And to ensure it only tracks once per page visit.
    if (tracked.current) return;
    tracked.current = true;
    
    // Setup a small delay so we don't block immediate initial render or immediately ping if user bounces under 1 second.
    const timer = setTimeout(() => {
      fetch("/api/profile/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        // Avoid keeping the tab alive if it closes during fetch
        keepalive: true, 
      }).catch(() => {});
    }, 1000);

    return () => clearTimeout(timer);
  }, [username]);

  return null; // Silent tracker
}
