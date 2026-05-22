import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db/db';
import { projects } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const { updates } = body as { updates: { id: string; displayOrder: number }[] };

	if (!Array.isArray(updates)) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
	}

	await Promise.all(
		updates.map(({ id, displayOrder }) =>
			db.update(projects).set({ displayOrder }).where(eq(projects.id, id))
		)
	);

	return NextResponse.json({ success: true });
}
