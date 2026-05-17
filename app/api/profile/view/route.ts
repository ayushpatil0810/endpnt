import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";

const COOKIE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    // Cookie-based deduplication: one count per visitor per username per 24h.
    // The cookie name is scoped to the username so visiting multiple profiles
    // each increments their own counter exactly once.
    const cookieKey = `ev_${username.toLowerCase().replace(/[^a-z0-9_-]/g, "")}`;
    const alreadyCounted = request.cookies.get(cookieKey);

    if (alreadyCounted) {
      // Visitor already counted within the dedup window — skip silently.
      return NextResponse.json({ success: true, counted: false });
    }

    await db
      .update(users)
      .set({ views: sql`${users.views} + 1` })
      .where(eq(users.username, username));

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

