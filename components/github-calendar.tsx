import ActivityCalendar from "./ActivityCalendarWrapper";
import { getGithubProfile } from "@/lib/github";

export async function GithubCalendar({ username, themeId }: { username: string; themeId: string }) {
  const profile = await getGithubProfile(username);
  if (!profile || !profile.calendarData || profile.calendarData.length === 0) {
    return null;
  }

  // ActivityCalendar expects an array of { date, count, level }
  return (
    <div className="w-full flex items-center justify-center overflow-x-auto overflow-y-hidden pb-2" style={{ color: "var(--theme-text-primary)" }}>
      <ActivityCalendar
        data={profile.calendarData as any}
        colorScheme={themeId === "glassmorphism" || themeId === "neo-brutalism" ? "dark" : "light"}
        theme={{
          light: ['var(--theme-separator)', 'var(--theme-accent)'],
          dark: ['var(--theme-separator)', 'var(--theme-accent)'],
        }}
        fontSize={12}
        blockSize={12}
        blockMargin={4}
        hideColorLegend
        hideTotalCount
      />
    </div>
  );
}
