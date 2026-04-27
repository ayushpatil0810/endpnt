import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { projects } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, description, liveUrl, githubUrl, techStack } = body;

  if (title !== undefined && !title?.trim()) {
    return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
  }

  const [updated] = await db
    .update(projects)
    .set({
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(liveUrl !== undefined && { liveUrl: liveUrl?.trim() || null }),
      ...(githubUrl !== undefined && { githubUrl: githubUrl?.trim() || null }),
      ...(techStack !== undefined && {
        techStack: Array.isArray(techStack) ? techStack.filter(Boolean) : [],
      }),
    })
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
