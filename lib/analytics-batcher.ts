/**
 * Analytics tracking with Redis-backed counters.
 *
 * Architecture:
 *   - View/click COUNTERS → Redis INCR (atomic, distributed, works across
 *     all serverless invocations — no in-memory buffer needed)
 *   - Event ROWS → Postgres INSERT via Next.js `after()` (non-blocking,
 *     response is sent first, insert happens in background)
 *
 * Why this replaces the old in-memory buffer:
 *   The previous `viewBuffer`/`clickBuffer` arrays were module-level state.
 *   In serverless environments (Vercel), each function invocation starts
 *   with a fresh module — the buffer is always empty, so BATCH_SIZE was
 *   never reached. Every event flushed immediately as a single DB write.
 *   Redis INCR is a single O(1) atomic operation that works correctly
 *   across all invocations without any shared state.
 */

import { Redis } from '@upstash/redis';
import { db } from '@/db/db';
import { events } from '@/db/schema/schema';
import { after } from 'next/server';

// ── Redis client (gracefully absent in local dev without credentials) ────────

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
	redis = new Redis({
		url: process.env.UPSTASH_REDIS_REST_URL,
		token: process.env.UPSTASH_REDIS_REST_TOKEN,
	});
}

// ── Redis key helpers ────────────────────────────────────────────────────────

/** Atomic profile view counter: INCR endpnt:views:<userId> */
const viewCountKey = (userId: string) => `endpnt:views:${userId}`;

/** Atomic link click counter: INCR endpnt:clicks:<linkId> */
const clickCountKey = (linkId: string) => `endpnt:clicks:${linkId}`;

// ── Public API ────────────────────────────────────────────────────────────────

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

/**
 * Tracks a profile view:
 *   1. Atomically increments the Redis view counter for this user.
 *   2. Schedules a Postgres `events` row insert via `after()` (post-response).
 *
 * If Redis is unavailable (local dev / missing env), falls back to a direct
 * Postgres counter update inside `after()`.
 */
export function trackProfileView(event: ViewEvent): void {
	if (redis) {
		// Redis path: O(1) atomic counter increment — works across all invocations
		redis.incr(viewCountKey(event.userId)).catch((err) => {
			console.error('Redis view INCR failed:', err);
		});
	}

	// Always insert the event row non-blocking after the response is sent
	after(async () => {
		try {
			await db.insert(events).values({
				userId: event.userId,
				type: 'view',
				referrer: event.referrer ? event.referrer.substring(0, 255) : null,
			});

			// Fallback: if Redis is absent, update the counter in Postgres too
			if (!redis) {
				const { users } = await import('@/db/schema/schema');
				const { sql } = await import('drizzle-orm');
				await db
					.update(users)
					.set({ views: sql`${users.views} + 1` })
					.where(sql`${users.username} = ${event.username}`);
			}
		} catch (err) {
			console.error('Failed to insert view event:', err);
		}
	});
}

/**
 * Tracks a link click:
 *   1. Atomically increments the Redis click counter for this link.
 *   2. Schedules a Postgres `events` row insert via `after()` (post-response).
 *
 * If Redis is unavailable, falls back to a direct Postgres counter update.
 */
export function trackLinkClick(event: ClickEvent): void {
	if (redis) {
		redis.incr(clickCountKey(event.linkId)).catch((err) => {
			console.error('Redis click INCR failed:', err);
		});
	}

	after(async () => {
		try {
			await db.insert(events).values({
				userId: event.userId,
				linkId: event.linkId,
				type: 'click',
				referrer: event.referrer ? event.referrer.substring(0, 255) : null,
			});

			if (!redis) {
				const { links } = await import('@/db/schema/schema');
				const { sql, eq } = await import('drizzle-orm');
				await db
					.update(links)
					.set({ clicks: sql`${links.clicks} + 1` })
					.where(eq(links.id, event.linkId));
			}
		} catch (err) {
			console.error('Failed to insert click event:', err);
		}
	});
}

// ── Counter flush helpers (for cron jobs / background sync) ─────────────────

/**
 * Reads and resets the Redis view counter for a user, then applies it to
 * Postgres. Call this from a scheduled cron endpoint to sync Redis → Postgres.
 *
 * Uses GETDEL so the read+reset is atomic — no double-counting on retries.
 */
export async function flushViewCounter(userId: string): Promise<number> {
	if (!redis) return 0;
	const count = await redis.getdel(viewCountKey(userId));
	if (!count || Number(count) === 0) return 0;

	const { users } = await import('@/db/schema/schema');
	const { sql } = await import('drizzle-orm');
	await db
		.update(users)
		.set({ views: sql`${users.views} + ${Number(count)}` })
		.where(sql`${users.id} = ${userId}`);

	return Number(count);
}

/**
 * Reads and resets the Redis click counter for a link, then applies it to
 * Postgres. Call this from a scheduled cron endpoint.
 */
export async function flushClickCounter(linkId: string): Promise<number> {
	if (!redis) return 0;
	const count = await redis.getdel(clickCountKey(linkId));
	if (!count || Number(count) === 0) return 0;

	const { links } = await import('@/db/schema/schema');
	const { sql, eq } = await import('drizzle-orm');
	await db
		.update(links)
		.set({ clicks: sql`${links.clicks} + ${Number(count)}` })
		.where(eq(links.id, linkId));

	return Number(count);
}
