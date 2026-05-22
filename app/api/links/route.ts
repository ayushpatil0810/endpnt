import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db/db';
import { links, users } from '@/db/schema/schema';
import { eq, asc } from 'drizzle-orm';
import { isUrlSafe } from '@/lib/security';
import { CreateLinkSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	// Look up our custom users table by Better Auth user id
	const userRow = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

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
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const parsed = CreateLinkSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { title, url } = parsed.data;

	const safe = await isUrlSafe(url);
	if (!safe) {
		return NextResponse.json({ error: 'Unsafe or blocked URL' }, { status: 400 });
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

	const [user] = await db
		.select({ username: users.username })
		.from(users)
		.where(eq(users.id, session.user.id))
		.limit(1);
	if (user?.username) {
		const { revalidatePath } = require('next/cache');
		revalidatePath(`/${user.username}`);
	}

	return NextResponse.json(newLink, { status: 201 });
}
