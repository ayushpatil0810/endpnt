import { db } from "@/db/db";
import { events, links, users } from "@/db/schema/schema";
import { sql } from "drizzle-orm";
import { after } from "next/server";

interface ViewEvent {
  userId: string;
  username: string;
  referrer: string | null;
}

interface ClickEvent {
  userId: string;
  linkId: string;
  referrer: string | null;
}

const BATCH_SIZE = 5;
const viewBuffer: ViewEvent[] = [];
const clickBuffer: ClickEvent[] = [];

/**
 * Tracks a profile view using in-memory batching.
 * Flushes to the database when BATCH_SIZE is reached,
 * or at the end of the request via Next.js `after()`.
 */
export function trackProfileView(event: ViewEvent) {
  viewBuffer.push(event);
  
  if (viewBuffer.length >= BATCH_SIZE) {
    // Flush synchronously if we hit the limit
    flushViews([...viewBuffer]).catch(console.error);
    viewBuffer.length = 0;
  } else {
    // Ensure we flush at the end of the response cycle if under batch limit
    after(() => {
      if (viewBuffer.length > 0) {
        flushViews([...viewBuffer]).catch(console.error);
        viewBuffer.length = 0;
      }
    });
  }
}

/**
 * Tracks a link click using in-memory batching.
 * Flushes to the database when BATCH_SIZE is reached,
 * or at the end of the request via Next.js `after()`.
 */
export function trackLinkClick(event: ClickEvent) {
  clickBuffer.push(event);
  
  if (clickBuffer.length >= BATCH_SIZE) {
    flushClicks([...clickBuffer]).catch(console.error);
    clickBuffer.length = 0;
  } else {
    after(() => {
      if (clickBuffer.length > 0) {
        flushClicks([...clickBuffer]).catch(console.error);
        clickBuffer.length = 0;
      }
    });
  }
}

async function flushViews(viewsToFlush: ViewEvent[]) {
  if (viewsToFlush.length === 0) return;

  const usernames = Array.from(new Set(viewsToFlush.map((v) => v.username)));
  const eventInserts = viewsToFlush.map((v) => ({
    userId: v.userId,
    type: "view" as const,
    referrer: v.referrer ? v.referrer.substring(0, 255) : null,
  }));

  try {
    const promises = [];

    // Batch update view counts
    for (const username of usernames) {
      const count = viewsToFlush.filter((v) => v.username === username).length;
      promises.push(
        db
          .update(users)
          .set({ views: sql`${users.views} + ${count}` })
          .where(sql`${users.username} = ${username}`)
      );
    }

    // Batch insert events
    promises.push(db.insert(events).values(eventInserts));

    await Promise.all(promises);
  } catch (err) {
    console.error("Failed to flush views batch:", err);
  }
}

async function flushClicks(clicksToFlush: ClickEvent[]) {
  if (clicksToFlush.length === 0) return;

  const linkIds = Array.from(new Set(clicksToFlush.map((c) => c.linkId)));
  const eventInserts = clicksToFlush.map((c) => ({
    userId: c.userId,
    linkId: c.linkId,
    type: "click" as const,
    referrer: c.referrer ? c.referrer.substring(0, 255) : null,
  }));

  try {
    const promises = [];

    // Batch update click counts
    for (const linkId of linkIds) {
      const count = clicksToFlush.filter((c) => c.linkId === linkId).length;
      promises.push(
        db
          .update(links)
          .set({ clicks: sql`${links.clicks} + ${count}` })
          .where(sql`${links.id} = ${linkId}`)
      );
    }

    // Batch insert events
    promises.push(db.insert(events).values(eventInserts));

    await Promise.all(promises);
  } catch (err) {
    console.error("Failed to flush clicks batch:", err);
  }
}
