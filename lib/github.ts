import { cache } from 'react';

export interface GithubLanguage {
	name: string;
	color: string;
	size: number;
	percentage: number;
}

export interface GithubRepo {
	name: string;
	description: string | null;
	url: string;
	stargazerCount: number;
	forkCount: number;
	primaryLanguage: { name: string; color: string } | null;
}

export interface GithubActivityEvent {
	id: string;
	type: string;
	repoName: string;
	createdAt: string;
	url: string;
	message: string | null;
}

export interface GithubProfileData {
	username: string;
	status: { message: string; emojiHTML: string | null } | null;
	pinnedRepos: GithubRepo[];
	languages: GithubLanguage[];
	totalContributions: number;
	calendarData: { date: string; count: number; level: number }[];
	recentActivity: GithubActivityEvent[];
	// Fallbacks if graphql fails
	followers?: number;
	publicRepos?: number;
}

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
const GITHUB_REST_API = 'https://api.github.com';

/**
 * Centralized GitHub abstraction layer.
 * Fetches and normalizes data using Next.js caching to prevent API waterfalls.
 */
export const getGithubProfile = cache(
	async (username: string): Promise<GithubProfileData | null> => {
		if (!username) return null;

		const token = process.env.GITHUB_ACCESS_TOKEN;

		if (!token) {
			console.warn(
				'GITHUB_ACCESS_TOKEN is not set. GitHub Identity Layer will gracefully degrade.'
			);
			// Fallback to minimal REST fetch if no token is available
			return fetchMinimalRestData(username);
		}

		try {
			const [graphQlData, restEvents] = await Promise.all([
				fetchGraphqlData(username, token),
				fetchRestEvents(username, token),
			]);

			if (!graphQlData) return null;

			return {
				username,
				status: graphQlData.status,
				pinnedRepos: graphQlData.pinnedRepos,
				languages: graphQlData.languages,
				totalContributions: graphQlData.totalContributions,
				calendarData: graphQlData.calendarData,
				recentActivity: restEvents,
				followers: graphQlData.followers,
				publicRepos: graphQlData.publicRepos,
			};
		} catch (error) {
			console.error('Failed to fetch GitHub profile data:', error);
			return null;
		}
	}
);

async function fetchGraphqlData(username: string, token: string) {
	const query = `
    query($username: String!) {
      user(login: $username) {
        followers { totalCount }
        repositories(privacy: PUBLIC) { totalCount }
        status {
          message
          emojiHTML
        }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              forkCount
              url
              primaryLanguage {
                name
                color
              }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        # Fetch top 100 repos to calculate languages
        topRepos: repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

	const res = await fetch(GITHUB_GRAPHQL_API, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query, variables: { username } }),
		next: { revalidate: 3600 }, // Cache for 1 hour
	});

	if (!res.ok) {
		throw new Error(`GitHub GraphQL API returned ${res.status}`);
	}

	const json = await res.json();
	if (json.errors || !json.data?.user) {
		return null;
	}

	const user = json.data.user;

	// Process languages
	const langMap = new Map<string, { size: number; color: string }>();
	let totalSize = 0;

	user.topRepos.nodes.forEach((repo: any) => {
		repo.languages?.edges?.forEach((edge: any) => {
			const name = edge.node.name;
			const size = edge.size;
			const color = edge.node.color;
			totalSize += size;

			if (langMap.has(name)) {
				langMap.get(name)!.size += size;
			} else {
				langMap.set(name, { size, color });
			}
		});
	});

	const languages: GithubLanguage[] = Array.from(langMap.entries())
		.map(([name, data]) => ({
			name,
			color: data.color || '#ccc',
			size: data.size,
			percentage: totalSize > 0 ? (data.size / totalSize) * 100 : 0,
		}))
		.sort((a, b) => b.size - a.size)
		.slice(0, 5); // Top 5

	// Process calendar data for react-activity-calendar
	const calendarData: { date: string; count: number; level: number }[] = [];
	user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
		week.contributionDays.forEach((day: any) => {
			let level = 0;
			if (day.contributionCount > 0 && day.contributionCount <= 3) level = 1;
			else if (day.contributionCount <= 6) level = 2;
			else if (day.contributionCount <= 10) level = 3;
			else if (day.contributionCount > 10) level = 4;

			calendarData.push({
				date: day.date,
				count: day.contributionCount,
				level,
			});
		});
	});

	return {
		followers: user.followers.totalCount,
		publicRepos: user.repositories.totalCount,
		status: user.status,
		pinnedRepos: user.pinnedItems.nodes,
		totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
		calendarData,
		languages,
	};
}

async function fetchRestEvents(username: string, token: string): Promise<GithubActivityEvent[]> {
	const res = await fetch(`${GITHUB_REST_API}/users/${username}/events/public?per_page=15`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
		},
		next: { revalidate: 3600 },
	});

	if (!res.ok) return [];

	const events = await res.json();
	if (!Array.isArray(events)) return [];

	const formattedEvents: GithubActivityEvent[] = [];

	for (const event of events) {
		// Only care about certain types for the feed
		if (['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(event.type)) {
			let message = null;
			let url = `https://github.com/${event.repo.name}`;

			if (event.type === 'PushEvent' && event.payload.commits?.length > 0) {
				message = event.payload.commits[0].message;
				url = `https://github.com/${event.repo.name}/commit/${event.payload.commits[0].sha}`;
			} else if (event.type === 'PullRequestEvent') {
				message = event.payload.pull_request?.title;
				url = event.payload.pull_request?.html_url;
			} else if (event.type === 'IssuesEvent') {
				message = event.payload.issue?.title;
				url = event.payload.issue?.html_url;
			} else if (event.type === 'CreateEvent') {
				message = `Created ${event.payload.ref_type} ${event.payload.ref || ''}`;
			}

			formattedEvents.push({
				id: event.id,
				type: event.type,
				repoName: event.repo.name,
				createdAt: event.created_at,
				url,
				message,
			});

			if (formattedEvents.length >= 5) break; // Limit to 5
		}
	}

	return formattedEvents;
}

// Fallback for when no PAT is provided
async function fetchMinimalRestData(username: string): Promise<GithubProfileData | null> {
	const res = await fetch(`${GITHUB_REST_API}/users/${username}`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return null;
	const data = await res.json();

	return {
		username: data.login,
		status: null,
		pinnedRepos: [], // Cannot get pinned via REST reliably without scraping
		languages: [], // Too many requests to calculate via REST
		totalContributions: 0,
		calendarData: [], // Cannot get heatmap data via REST
		recentActivity: [],
		followers: data.followers,
		publicRepos: data.public_repos,
	};
}
