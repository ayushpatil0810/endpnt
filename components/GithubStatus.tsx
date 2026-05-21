import { getGithubProfile } from "@/lib/github";
import { IconCircleFilled } from "@tabler/icons-react";

export async function GithubStatus({ username }: { username: string }) {
  const profile = await getGithubProfile(username);
  if (!profile) return null;

  // Derive status from explicit GitHub status or recent push activity
  let statusText = null;
  let emoji = null;

  if (profile.status?.message) {
    statusText = profile.status.message;
    emoji = profile.status.emojiHTML;
  } else if (profile.recentActivity?.length > 0) {
    const latest = profile.recentActivity[0];
    if (latest.type === "PushEvent") {
      statusText = `Hacking on ${latest.repoName.split("/")[1] || latest.repoName}`;
    } else if (latest.type === "PullRequestEvent") {
      statusText = `Reviewing ${latest.repoName.split("/")[1] || latest.repoName}`;
    }
  }

  if (!statusText) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/20 bg-foreground/5 text-xs font-medium max-w-full backdrop-blur-sm animate-in fade-in zoom-in duration-500">
      {emoji ? (
        <span dangerouslySetInnerHTML={{ __html: emoji }} className="w-4 h-4 flex items-center justify-center [&>g-emoji]:font-emoji" />
      ) : (
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
      )}
      <span className="truncate text-muted-foreground">{statusText}</span>
    </div>
  );
}
