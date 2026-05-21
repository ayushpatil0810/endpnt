import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { projects, users } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import { UpdateProjectSchema, validationError } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const parsed = UpdateProjectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { title, description, liveUrl, githubUrl, techStack } = parsed.data;

  const updateData = {
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description?.trim() || null }),
    ...(liveUrl !== undefined && { liveUrl: liveUrl?.trim() || null }),
    ...(githubUrl !== undefined && { githubUrl: githubUrl?.trim() || null }),
    ...(techStack !== undefined && {
      techStack: Array.isArray(techStack) ? techStack.filter(Boolean) : [],
    }),
  };

  const [updated] = await db
    .update(projects)
    .set(updateData)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, session.user.id)).limit(1);
  if (user?.username) {
    const { revalidatePath } = require("next/cache");
    revalidatePath(`/${user.username}`);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [deleted] = await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, session.user.id)).limit(1);
  if (user?.username) {
    const { revalidatePath } = require("next/cache");
    revalidatePath(`/${user.username}`);
  }

  return NextResponse.json({ success: true });
}
