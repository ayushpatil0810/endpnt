import { getGithubProfile } from "@/lib/github";
import { IconGitCommit, IconGitMerge, IconGitPullRequest, IconAlertCircle } from "@tabler/icons-react";
import { ThemedCard } from "@/components/profile/themed-card";
import type { ThemeDefinition } from "@/lib/themes";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

function getActivityIcon(type: string) {
  switch (type) {
    case "PushEvent": return <IconGitCommit size={14} />;
    case "PullRequestEvent": return <IconGitPullRequest size={14} />;
    case "IssuesEvent": return <IconAlertCircle size={14} />;
    default: return <IconGitMerge size={14} />;
  }
}

export async function GithubActivityFeed({ username, theme }: { username: string; theme: ThemeDefinition }) {
  const profile = await getGithubProfile(username);
  if (!profile || !profile.recentActivity?.length) return null;

  return (
    <ThemedCard theme={theme} className="w-full p-5 sm:p-6 h-full">
      <h2 
        className="text-[10px] font-mono tracking-widest uppercase border-b pb-2 mb-4"
        style={{ color: "var(--theme-text-secondary)", borderColor: "var(--theme-separator)" }}
      >
        Recent Activity
      </h2>
      <div className="flex flex-col gap-4">
        {profile.recentActivity.map((event) => (
          <div key={event.id} className="flex gap-3 items-start group">
            <div 
              className="mt-0.5 p-1.5 rounded-md border transition-opacity hover:opacity-80"
              style={{ color: "var(--theme-text-secondary)", borderColor: "var(--theme-separator)", backgroundColor: "transparent" }}
            >
              {getActivityIcon(event.type)}
            </div>
            <div className="flex flex-col flex-1 min-w-0 py-0.5">
              <div className="flex items-center justify-between gap-2">
                <a 
                  href={`https://github.com/${event.repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold hover:underline truncate"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {event.repoName}
                </a>
                <span className="text-[10px] whitespace-nowrap font-mono" style={{ color: "var(--theme-text-secondary)" }}>
                  {timeAgo(event.createdAt)}
                </span>
              </div>
              {event.message && (
                <a 
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] truncate hover:underline transition-all mt-0.5"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {event.message}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </ThemedCard>
  );
}
