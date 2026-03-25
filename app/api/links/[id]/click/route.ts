import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { links } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.id, id));

  return NextResponse.json({ success: true });
}
