import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { links, events } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { trackLinkClick } from "@/lib/analytics-batcher";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [link] = await db
      .select({ userId: links.userId })
      .from(links)
      .where(eq(links.id, id))
      .limit(1);

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const referrer =
      request.headers.get("referer") || request.headers.get("referrer") || null;

    trackLinkClick({
      userId: link.userId,
      linkId: id,
      referrer: referrer ? referrer.substring(0, 255) : null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
