import { ProfileHeader } from "@/components/ProfileHeader";

interface ProfileTabProps {
  username: string;
  bio: string;
  avatarUrl: string | null;
  setBio: (bio: string) => void;
  githubUsername: string;
  setGithubUsername: (val: string) => void;
  leetcodeUsername: string;
  setLeetcodeUsername: (val: string) => void;
  devtoUsername: string;
  setDevtoUsername: (val: string) => void;
  mediumUsername: string;
  setMediumUsername: (val: string) => void;
  hashnodeUsername: string;
  setHashnodeUsername: (val: string) => void;
  handleIntegrationSave: () => void;
}

export function ProfileTab({
  username,
  bio,
  avatarUrl,
  setBio,
  githubUsername,
  setGithubUsername,
  leetcodeUsername,
  setLeetcodeUsername,
  devtoUsername,
  setDevtoUsername,
  mediumUsername,
  setMediumUsername,
  hashnodeUsername,
  setHashnodeUsername,
  handleIntegrationSave,
}: ProfileTabProps) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>
        <ProfileHeader username={username} bio={bio} avatarUrl={avatarUrl} onBioUpdate={setBio} />
      </div>

      <div className="border-t border-border/40 pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Developer Integrations</h2>
        <div className="flex flex-col gap-5 max-w-xl">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">GitHub Username</label>
            <input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="e.g. torvalds" className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">LeetCode Username</label>
            <input value={leetcodeUsername} onChange={(e) => setLeetcodeUsername(e.target.value)} placeholder="e.g. neetcode" className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">Dev.to Username</label>
            <input value={devtoUsername} onChange={(e) => setDevtoUsername(e.target.value)} placeholder="e.g. ben" className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">Medium</label>
              <input value={mediumUsername} onChange={(e) => setMediumUsername(e.target.value)} placeholder="e.g. jdoe" className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1">Hashnode</label>
              <input value={hashnodeUsername} onChange={(e) => setHashnodeUsername(e.target.value)} placeholder="e.g. jdoe" className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case" />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={handleIntegrationSave} className="bg-foreground text-background px-6 py-2.5 rounded-md text-[10px] uppercase tracking-widest font-medium transition-colors hover:bg-foreground/90">
            Save Integrations
          </button>
        </div>
      </div>
    </div>
  );
}
