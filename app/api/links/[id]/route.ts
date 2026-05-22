import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db/db';
import { links, users } from '@/db/schema/schema';
import { eq, and } from 'drizzle-orm';
import { isUrlSafe } from '@/lib/security';
import { UpdateLinkSchema } from '@/lib/validators';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { id } = await params;
	const body = await request.json();

	const parsed = UpdateLinkSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { title, url, display_order } = parsed.data;

	const updateData: Record<string, unknown> = {};
	if (title !== undefined) updateData.title = title;
	if (url !== undefined) {
		const safe = await isUrlSafe(url);
		if (!safe) {
			return NextResponse.json({ error: 'Unsafe or blocked URL' }, { status: 400 });
		}
		updateData.url = url;
	}
	if (display_order !== undefined) updateData.displayOrder = display_order;

	const [updated] = await db
		.update(links)
		.set(updateData)
		.where(and(eq(links.id, id), eq(links.userId, session.user.id)))
		.returning();

	if (!updated) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	const [user] = await db
		.select({ username: users.username })
		.from(users)
		.where(eq(users.id, session.user.id))
		.limit(1);
	if (user?.username) {
		const { revalidatePath } = require('next/cache');
		revalidatePath(`/${user.username}`);
	}

	return NextResponse.json(updated);
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { id } = await params;

	const [deleted] = await db
		.delete(links)
		.where(and(eq(links.id, id), eq(links.userId, session.user.id)))
		.returning();

	if (!deleted) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	const [user] = await db
		.select({ username: users.username })
		.from(users)
		.where(eq(users.id, session.user.id))
		.limit(1);
	if (user?.username) {
		const { revalidatePath } = require('next/cache');
		revalidatePath(`/${user.username}`);
	}

	return NextResponse.json({ success: true });
}
