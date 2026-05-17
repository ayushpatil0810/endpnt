import { IconEye, IconClick, IconPercentage } from "@tabler/icons-react";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

interface Event {
  type: string;
  createdAt: Date;
}

interface AnalyticsDashboardProps {
  views: number;
  links: AnalyticsLink[];
  events?: Event[];
}

export function AnalyticsDashboard({ views, links, events = [] }: AnalyticsDashboardProps) {
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const ctr = views > 0 ? ((totalClicks / views) * 100).toFixed(1) : "0.0";

  // Sort links by clicks, take top 4
  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 4);
  const maxClicks = Math.max(...topLinks.map(l => l.clicks), 1); // Avoid div by 0

  // Group events by day for the chart
  const chartData = useMemo(() => {
    if (!events.length) return [];
    
    // Create a map of last 30 days
    const daysMap = new Map<string, { name: string; views: number; clicks: number }>();
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Format as "MMM DD"
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const isoStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      daysMap.set(isoStr, { name: dateStr, views: 0, clicks: 0 });
    }
    
    events.forEach(event => {
      const isoStr = new Date(event.createdAt).toISOString().split("T")[0];
      const entry = daysMap.get(isoStr);
      if (entry) {
        if (event.type === "view") entry.views += 1;
        if (event.type === "click") entry.clicks += 1;
      }
    });
    
    return Array.from(daysMap.values());
  }, [events]);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Views */}
        <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-none bg-card border border-border/70 shadow-sm ring-1 ring-white/[0.04] dark:border-border/60 dark:ring-white/[0.06]">
          <div className="flex items-center gap-2 text-muted-foreground/80">
            <IconEye size={18} />
            <span className="text-[10px] uppercase font-mono tracking-widest font-medium">Profile Views</span>
          </div>
          <span className="text-3xl font-semibold tracking-tight text-foreground normal-case">{views.toLocaleString()}</span>
        </div>

        {/* Clicks */}
        <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-none bg-card border border-border/70 shadow-sm ring-1 ring-white/[0.04] dark:border-border/60 dark:ring-white/[0.06]">
          <div className="flex items-center gap-2 text-muted-foreground/80">
            <IconClick size={18} />
            <span className="text-[10px] uppercase font-mono tracking-widest font-medium">Link Clicks</span>
          </div>
          <span className="text-3xl font-semibold tracking-tight text-foreground normal-case">{totalClicks.toLocaleString()}</span>
        </div>

        {/* CTR */}
        <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-none bg-card border border-border/70 shadow-sm ring-1 ring-white/[0.04] dark:border-border/60 dark:ring-white/[0.06]">
          <div className="flex items-center gap-2 text-muted-foreground/80">
            <IconPercentage size={18} />
            <span className="text-[10px] uppercase font-mono tracking-widest font-medium">CTR</span>
          </div>
          <div className="flex items-baseline gap-1 normal-case">
            <span className="text-3xl font-semibold tracking-tight text-foreground">{ctr}</span>
            <span className="text-sm text-muted-foreground mb-1 font-medium">%</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="flex flex-col p-6 sm:p-8 rounded-none bg-card border border-border/70 shadow-sm ring-1 ring-white/[0.04] dark:ring-white/[0.06]">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
            <h2 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-medium">
              30-Day Activity
            </h2>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="views" name="Views" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Links Chart */}
      {topLinks.length > 0 && totalClicks > 0 && (
        <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-none bg-card border border-border/70 shadow-sm ring-1 ring-white/[0.04] dark:ring-white/[0.06]">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h2 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-medium">
              Top Performing Links
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {topLinks.filter(l => l.clicks > 0).map((link, idx) => {
              const percentage = Math.round((link.clicks / maxClicks) * 100);
              const opacity = Math.max(0.3, 1 - (idx * 0.2));
              
              return (
                <div key={link.id} className="flex flex-col gap-2.5 relative group">
                  <div className="flex justify-between items-end text-sm w-full">
                    <span className="font-medium text-foreground tracking-wide truncate max-w-[70%] normal-case">
                      {link.title || link.url.replace("https://", "").replace("http://", "")}
                    </span>
                    <span className="font-mono text-muted-foreground text-xs normal-case">{link.clicks} clicks</span>
                  </div>
                  
                  {/* Progress Bar Background */}
                  <div className="w-full h-1.5 sm:h-2 bg-muted/20 rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div 
                      className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        opacity: opacity
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
