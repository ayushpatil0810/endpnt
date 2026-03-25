import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { links } from "@/db/schema/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { updates } = body as { updates: { id: string; displayOrder: number }[] };

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Bulk update on the server side to avoid an N+1 API call bottleneck from the client
    await Promise.all(
      updates.map((update) =>
        db
          .update(links)
          .set({ displayOrder: update.displayOrder })
          .where(and(eq(links.id, update.id), eq(links.userId, session.user.id)))
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
