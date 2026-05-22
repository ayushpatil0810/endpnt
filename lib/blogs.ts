export interface BlogPost {
	title: string;
	url: string;
	publishedAt: string;
	description?: string;
	source: 'medium' | 'hashnode';
}

/**
 * Fetches the latest posts from a Medium user's RSS feed.
 */
export async function fetchMediumPosts(username: string): Promise<BlogPost[]> {
	try {
		const res = await fetch(`https://medium.com/feed/@${username}`, { next: { revalidate: 3600 } });
		if (!res.ok) return [];

		const xml = await res.text();

		// Parse <item> blocks from the RSS XML
		const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
		const posts: BlogPost[] = [];

		for (const match of itemMatches) {
			const item = match[1];

			const title = extractXml(item, 'title');
			const link = extractXml(item, 'link') || extractXml(item, 'guid');
			const pubDate = extractXml(item, 'pubDate');
			const description = stripHtml(extractXml(item, 'description') ?? '').slice(
				0,
				MAX_DESCRIPTION_LENGTH
			);

			if (title && link) {
				posts.push({
					title,
					url: link,
					publishedAt: pubDate ?? '',
					description: description || undefined,
					source: 'medium',
				});
			}

			if (posts.length >= 3) break;
		}

		return posts;
	} catch {
		return [];
	}
}

/**
 * Fetches the latest posts from a Hashnode user via the public GraphQL API.
 */
export async function fetchHashnodePosts(username: string): Promise<BlogPost[]> {
	try {
		const query = `
      query GetUserPosts($username: String!) {
        user(username: $username) {
          publications(first: 1) {
            edges {
              node {
                posts(first: 3) {
                  edges {
                    node {
                      title
                      url
                      publishedAt
                      brief
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

		const res = await fetch('https://gql.hashnode.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, variables: { username } }),
			next: { revalidate: 3600 },
		});

		if (!res.ok) return [];

		const json = await res.json();
		const edges: Array<{
			node: { title: string; url: string; publishedAt: string; brief?: string };
		}> = json?.data?.user?.publications?.edges?.[0]?.node?.posts?.edges ?? [];

		return edges.map(({ node }) => ({
			title: node.title,
			url: node.url,
			publishedAt: node.publishedAt,
			description: node.brief,
			source: 'hashnode' as const,
		}));
	} catch {
		return [];
	}
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const MAX_DESCRIPTION_LENGTH = 200;

function extractXml(xml: string, tag: string): string | undefined {
	const cdataPattern = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`);
	const plainPattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
	const cdataMatch = xml.match(cdataPattern);
	if (cdataMatch) return cdataMatch[1]?.trim();
	const plainMatch = xml.match(plainPattern);
	return plainMatch ? plainMatch[1]?.trim() : undefined;
}

function stripHtml(html: string): string {
	// Repeatedly remove tags until none remain, preventing partial-tag bypass
	let text = html;
	let prev: string;
	do {
		prev = text;
		text = text.replace(/<[^>]*>/g, '');
	} while (text !== prev);
	return text.replace(/&[a-z]+;/gi, ' ').trim();
}
