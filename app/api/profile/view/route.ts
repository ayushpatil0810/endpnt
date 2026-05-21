import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { users, events } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";

const COOKIE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const cookieKey = `ev_${username.toLowerCase().replace(/[^a-z0-9_-]/g, "")}`;
    const alreadyCounted = request.cookies.get(cookieKey);

    if (alreadyCounted) {
      return NextResponse.json({ success: true, counted: false });
    }

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referrer = request.headers.get("referer") || request.headers.get("referrer") || null;

    await Promise.all([
      db
        .update(users)
        .set({ views: sql`${users.views} + 1` })
        .where(eq(users.username, username)),
      db.insert(events).values({
        userId: user.id,
        type: "view",
        referrer: referrer ? referrer.substring(0, 255) : null,
      }),
    ]);

    const response = NextResponse.json({ success: true, counted: true });
    response.cookies.set(cookieKey, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}


