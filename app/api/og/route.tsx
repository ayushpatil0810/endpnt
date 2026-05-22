import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { db } from '@/db/db';
import { users } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const themeGradients: Record<string, [string, string]> = {
	glassmorphism: ['#0f0c29', '#302b63'],
	'neo-brutalism': ['#f5f0e8', '#e8dcc8'],
	neumorphism: ['#e0e5ec', '#c8d0e0'],
	claymorphism: ['#fce4ec', '#f3e5f5'],
};

const themeText: Record<string, string> = {
	glassmorphism: '#ffffff',
	'neo-brutalism': '#1a1a1a',
	neumorphism: '#2d3748',
	claymorphism: '#4a1942',
};

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get('username');

	if (!username) {
		return new Response('Missing username', { status: 400 });
	}

	const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);

	if (!user) {
		return new Response('User not found', { status: 404 });
	}

	const theme = user.theme ?? 'default';
	const [gradientFrom, gradientTo] = themeGradients[theme] ?? themeGradients.default;
	const textColor = themeText[theme] ?? themeText.default;

	return new ImageResponse(
		<div
			style={{
				width: '1200px',
				height: '630px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
				fontFamily: 'sans-serif',
				position: 'relative',
			}}
		>
			{user.avatarUrl && (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={user.avatarUrl}
					alt={user.username}
					width={128}
					height={128}
					style={{
						borderRadius: '50%',
						marginBottom: '24px',
						border: `4px solid ${textColor}20`,
					}}
				/>
			)}
			<div
				style={{
					fontSize: '64px',
					fontWeight: 700,
					color: textColor,
					marginBottom: '16px',
					letterSpacing: '-2px',
					textAlign: 'center',
					maxWidth: '900px',
					lineHeight: 1.2,
				}}
			>
				{user.seoTitle || `@${user.username}`}
			</div>
			{(user.seoDescription || user.bio) && (
				<div
					style={{
						fontSize: '28px',
						color: textColor,
						opacity: 0.7,
						maxWidth: '800px',
						textAlign: 'center',
						lineHeight: 1.4,
					}}
				>
					{user.seoDescription || user.bio}
				</div>
			)}
			<div
				style={{
					position: 'absolute',
					bottom: '32px',
					right: '40px',
					fontSize: '22px',
					fontWeight: 700,
					color: textColor,
					opacity: 0.5,
					letterSpacing: '-0.5px',
				}}
			>
				endpoint
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		}
	);
}
