import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db/db';
import { projects } from '@/db/schema/schema';
import { eq, asc } from 'drizzle-orm';
import { CreateProjectSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { users } from '@/db/schema/schema';

export async function GET(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const userProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.userId, session.user.id))
		.orderBy(asc(projects.displayOrder));

	return NextResponse.json(userProjects);
}

export async function POST(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const parsed = CreateProjectSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { title, description, liveUrl, githubUrl, techStack } = parsed.data;

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

	const [user] = await db
		.select({ username: users.username })
		.from(users)
		.where(eq(users.id, session.user.id))
		.limit(1);
	if (user?.username) {
		revalidatePath(`/${user.username}`);
	}

	return NextResponse.json(newProject, { status: 201 });
}
