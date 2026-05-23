import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db/db';
import { users } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export async function POST(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const { username } = body;

	if (!username || !USERNAME_REGEX.test(username)) {
		return NextResponse.json(
			{ error: 'Invalid username. Use 3–20 lowercase letters, numbers, or underscores.' },
			{ status: 400 }
		);
	}

	const [existing] = await db.select().from(users).where(eq(users.username, username)).limit(1);

	if (existing) {
		return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
	}

	const [self] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

	if (self) {
		const [updated] = await db
			.update(users)
			.set({ username })
			.where(eq(users.id, session.user.id))
			.returning();

		if (updated?.username) {
			revalidatePath(`/${updated.username}`);
		}
		return NextResponse.json(updated);
	}

	const [created] = await db
		.insert(users)
		.values({
			id: session.user.id,
			username,
			avatarUrl: session.user.image ?? null,
		})
		.returning();

	if (created?.username) {
		revalidatePath(`/${created.username}`);
	}

	return NextResponse.json(created, { status: 201 });
}
