import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { links, users } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Look up our custom users table by Better Auth user id
  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!userRow.length) {
    return NextResponse.json([], { status: 200 });
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, session.user.id))
    .orderBy(asc(links.displayOrder));

  return NextResponse.json(userLinks);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, url } = body;

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
  }

  // Get current max display_order
  const existing = await db
    .select()
    .from(links)
    .where(eq(links.userId, session.user.id))
    .orderBy(asc(links.displayOrder));

  const maxOrder = existing.length > 0 ? existing[existing.length - 1].displayOrder + 1 : 0;

  const [newLink] = await db
    .insert(links)
    .values({
      userId: session.user.id,
      title,
      url,
      displayOrder: maxOrder,
    })
    .returning();

  return NextResponse.json(newLink, { status: 201 });
}
