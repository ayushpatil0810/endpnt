const LEETCODE_COLOR = "#FFA116";

const LeetCodeIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ color: LEETCODE_COLOR }}
  >
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.513-.514.498-1.366-.037-1.901-.535-.535-1.387-.553-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.833-1.452l2.697-2.606c.514-.515.498-1.366-.037-1.901-.535-.535-1.387-.553-1.902-.038zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
  </svg>
);

export async function LeetcodeStats({ username }: { username: string }) {
  if (!username) return null;

  let data;
  try {
    const res = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    data = await res.json();

    // API returns errors as { errors: [...] } for invalid users
    if (data.errors) return null;
  } catch {
    return null;
  }

  return (
    <a
      href={`https://leetcode.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full p-6 rounded-none border border-border/40 bg-card/10 backdrop-blur-md flex flex-col gap-4 group hover:border-[#FFA116]/40 transition-colors relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFA116]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="flex items-center gap-3 z-10">
        <LeetCodeIcon />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            LeetCode
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            @{username}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 z-10">
        <div className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20">
          <span className="text-lg font-bold text-foreground">
            {data.solvedProblem || 0}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Solved
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20">
          <span className="text-lg font-bold text-emerald-400">
            {data.easySolved || 0}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Easy
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-none bg-card/20 border border-border/20">
          <span className="text-lg font-bold text-amber-500">
            {data.mediumSolved || 0}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Medium
          </span>
        </div>
      </div>
    </a>
  );
}
