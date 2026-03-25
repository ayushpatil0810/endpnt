import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { bio, theme, background, githubUsername, leetcodeUsername, devtoUsername, seoTitle, seoDescription } = body;

  const updateData: Record<string, unknown> = {};
  if (bio !== undefined) updateData.bio = bio;
  if (theme !== undefined) updateData.theme = theme;
  if (background !== undefined) updateData.background = background;
  if (githubUsername !== undefined) updateData.githubUsername = githubUsername === "" ? null : githubUsername;
  if (leetcodeUsername !== undefined) updateData.leetcodeUsername = leetcodeUsername === "" ? null : leetcodeUsername;
  if (devtoUsername !== undefined) updateData.devtoUsername = devtoUsername === "" ? null : devtoUsername;
  if (seoTitle !== undefined) updateData.seoTitle = seoTitle === "" ? null : seoTitle;
  if (seoDescription !== undefined) updateData.seoDescription = seoDescription === "" ? null : seoDescription;

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, session.user.id))
    .returning();

  if (updated?.username) {
    revalidatePath(`/${updated.username}`);
  }

  return NextResponse.json(updated);
}
