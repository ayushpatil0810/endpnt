import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { projects } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(asc(projects.displayOrder));

  return NextResponse.json(userProjects);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, description, liveUrl, githubUrl, techStack } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Get current max display_order
  const existing = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(asc(projects.displayOrder));

  const maxOrder = existing.length > 0 ? existing[existing.length - 1].displayOrder + 1 : 0;

  const [newProject] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      title: title.trim(),
      description: description?.trim() || null,
      liveUrl: liveUrl?.trim() || null,
      githubUrl: githubUrl?.trim() || null,
      techStack: Array.isArray(techStack) ? techStack.filter(Boolean) : [],
      displayOrder: maxOrder,
    })
    .returning();

  return NextResponse.json(newProject, { status: 201 });
}
