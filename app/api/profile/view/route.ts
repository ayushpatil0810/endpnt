import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

    await db.update(users)
      .set({ views: sql`${users.views} + 1` })
      .where(eq(users.username, username));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
