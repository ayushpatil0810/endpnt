import { db } from "@/db/db";
import { users, links, projects } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, cache } from "react";
import { PublicLinkButton } from "./public-link-button";
import { GithubStats } from "@/components/GithubStats";
import { LeetcodeStats } from "@/components/leetcode-stats";
import { DevtoPosts } from "@/components/DevToPosts";
import { GithubCalendar } from "@/components/github-calendar";
import { BlogPosts } from "@/components/BlogPosts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ViewTracker } from "@/components/ViewTracker";
import {
  GithubStatsSkeleton,
  GithubCalendarSkeleton,
  LeetcodeStatsSkeleton,
  DevtoPostsSkeleton,
  BlogPostsSkeleton,
} from "@/components/profile-skeletons";
import {
  IconFileText,
  IconExternalLink,
  IconBrandGithub,
  IconCode,
} from "@tabler/icons-react";
import { getTheme } from "@/lib/themes";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = 60;

/**
 * Cached per-request user lookup.
 */
const getUserByUsername = cache(async (username: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user ?? null;
});

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) return { title: "Not Found" };

  const title = user.seoTitle || `@${user.username} | Endpoint`;
  const description =
    user.seoDescription ||
    user.bio ||
    `Check out ${user.username}'s profile on Endpoint`;
  const ogImageUrl = `/api/og?username=${user.username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://endpnt.dev"}/${user.username}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) notFound();

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, user.id))
    .orderBy(asc(links.displayOrder));

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(asc(projects.displayOrder));

  const theme = getTheme(user.theme);
  const layout = (user as any).layout || "sidebar";

  const themeStyle = theme.cssVars as React.CSSProperties;

  return (
    <div
      data-theme={theme.id}
      className={`min-h-dvh flex flex-col items-center px-4 sm:px-8 py-16 sm:py-24 w-full relative overflow-x-hidden selection:bg-foreground/20 ${theme.pageClasses}`}
      style={{
        ...themeStyle,
        background: "var(--theme-bg)",
        color: "var(--theme-text-primary)",
      }}
    >
      <ViewTracker username={user.username} />
      <ThemeBackground themeId={theme.id} />

      {layout === "bento" && (
        <BentoLayout user={user} userLinks={userLinks} userProjects={userProjects} theme={theme} />
      )}
      {layout === "minimal" && (
        <MinimalLayout user={user} userLinks={userLinks} userProjects={userProjects} theme={theme} />
      )}
      {layout === "sidebar" && (
        <SidebarLayout user={user} userLinks={userLinks} userProjects={userProjects} theme={theme} />
      )}

      {/* Footer */}
      <footer
        className="mt-24 pt-12 pb-12 w-full flex flex-col items-center gap-4 text-[11px] font-mono tracking-widest uppercase relative z-10"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        <div
          className="w-12 h-px"
          style={{ background: "var(--theme-separator)" }}
        />
        <Link
          href="/"
          className="font-bold transition-colors hover:opacity-80"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Endpoint
        </Link>
      </footer>
    </div>
  );
}

/* ── Layout Architectures ────────────────────────────────────────────────── */

// 1. Sidebar Layout (Default)
function SidebarLayout({ user, userLinks, userProjects, theme }: any) {
  return (
    <div className="max-w-[1100px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8 relative z-10">
      <aside className="lg:col-span-4 flex flex-col">
        <div className="lg:sticky lg:top-8 flex flex-col gap-6">
          <HeroCard user={user} theme={theme} />
        </div>
      </aside>
      <main className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
        {userLinks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {userLinks.map((link: any, idx: number) => (
              <div
                key={link.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <PublicLinkButton link={link} themeId={theme.id} />
              </div>
            ))}
          </div>
        )}
        <DeveloperStats user={user} theme={theme} />
        <GithubCalendarCard user={user} theme={theme} />
        <ProjectsSection projects={userProjects} theme={theme} gridClass="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" />
        <ArticlesSection user={user} theme={theme} />
      </main>
    </div>
  );
}

// 2. Bento Layout
function BentoLayout({ user, userLinks, userProjects, theme }: any) {
  return (
    <div className="max-w-[1200px] w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10 auto-rows-max grid-flow-row-dense">
      <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:row-span-2">
        <HeroCard user={user} theme={theme} />
      </div>

      {userLinks.map((link: any, idx: number) => (
        <div
          key={link.id}
          className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
          style={{ animationDelay: `${(idx + 1) * 100}ms` }}
        >
          <PublicLinkButton link={link} themeId={theme.id} />
        </div>
      ))}

      {user.githubUsername && (
        <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col gap-2 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <GithubCalendarCard user={user} theme={theme} />
        </div>
      )}

      {user.githubUsername && (
        <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
          <GithubStatsCard user={user} theme={theme} />
        </div>
      )}

      {user.leetcodeUsername && (
        <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
          <LeetcodeStatsCard user={user} theme={theme} />
        </div>
      )}

      {userProjects.map((project: any, idx: number) => (
        <div
          key={project.id}
          className="col-span-2 md:col-span-2 lg:col-span-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
          style={{ animationDelay: `${(idx + 5) * 100}ms` }}
        >
          <ProjectCardUI project={project} theme={theme} />
        </div>
      ))}

      {(user.devtoUsername || user.mediumUsername || user.hashnodeUsername) && (
        <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
          <ArticlesSection user={user} theme={theme} />
        </div>
      )}
    </div>
  );
}

// 3. Minimal Layout
function MinimalLayout({ user, userLinks, userProjects, theme }: any) {
  return (
    <div className="max-w-[680px] w-full mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
      <HeroCard user={user} theme={theme} alignCenter />

      {userLinks.length > 0 && (
        <div className="flex flex-col gap-4">
          {userLinks.map((link: any, idx: number) => (
            <div
              key={link.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <PublicLinkButton link={link} themeId={theme.id} />
            </div>
          ))}
        </div>
      )}

      <DeveloperStats user={user} theme={theme} />
      <GithubCalendarCard user={user} theme={theme} />
      <ProjectsSection projects={userProjects} theme={theme} gridClass="flex flex-col gap-4" />
      <ArticlesSection user={user} theme={theme} />
    </div>
  );
}

/* ── UI Building Blocks ──────────────────────────────────────────────────── */

function HeroCard({ user, theme, alignCenter = false }: any) {
  return (
    <ThemedCard
      themeId={theme.id}
      className={`flex flex-col ${alignCenter ? 'items-center text-center' : 'items-center lg:items-start text-center lg:text-left'} justify-between p-8 min-h-[380px] group animate-in fade-in slide-in-from-bottom-8 duration-700 h-full`}
    >
      <div className={`flex flex-col ${alignCenter ? 'items-center' : 'items-center lg:items-start'} gap-6 w-full`}>
        <div
          className="size-28 sm:size-32 rounded-full overflow-hidden ring-4 shadow-xl bg-white/10 group-hover:scale-105 transition-transform duration-500 shrink-0"
          style={{
            border: theme.id === "neo-brutalism"
              ? "3px solid var(--theme-text-primary)"
              : "2px solid rgba(255,255,255,0.2)",
          }}
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={128}
              height={128}
              className="size-full object-cover"
              priority
            />
          ) : (
            <div
              className="size-full flex items-center justify-center text-4xl font-serif italic"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={`flex flex-col gap-2 w-full ${alignCenter ? 'items-center' : 'items-center lg:items-start'}`}>
          <h1
            className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight ${theme.id === "neo-brutalism" ? "font-mono" : ""
              }`}
            style={{ color: "var(--theme-text-primary)" }}
          >
            {user.username}
          </h1>
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            @{user.username}
          </p>

          {user.bio && (
            <p
              className="text-sm leading-relaxed font-mono mt-3 max-w-sm"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {user.resumeUrl && (
        <div className="w-full mt-8">
          <a
            href={user.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold w-full transition-all duration-200 hover:opacity-90"
            style={{
              background: "var(--theme-btn-bg)",
              color: "var(--theme-btn-text)",
              borderRadius: theme.id === "neo-brutalism" ? "0" : theme.id === "claymorphism" ? "1rem" : "0.75rem",
              border: theme.id === "neo-brutalism" ? "2.5px solid var(--theme-text-primary)" : "none",
              boxShadow: theme.id === "neo-brutalism"
                ? "4px 4px 0px var(--theme-text-primary)"
                : theme.id === "neumorphism"
                  ? "var(--theme-btn-shadow)"
                  : theme.id === "claymorphism"
                    ? "0 4px 0px #d4b8e0"
                    : "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <IconFileText size={18} />
            View Resume
          </a>
        </div>
      )}
    </ThemedCard>
  );
}

function GithubStatsCard({ user, theme }: any) {
  return (
    <ThemedCard themeId={theme.id} className="flex flex-col gap-4 p-6 h-full">
      <h2
        className="text-[10px] font-mono tracking-widest uppercase pb-3"
        style={{
          color: "var(--theme-text-secondary)",
          borderBottom: "1px solid var(--theme-separator)",
        }}
      >
        GitHub
      </h2>
      <ErrorBoundary fallbackMessage="Failed to load GitHub stats">
        <Suspense fallback={<GithubStatsSkeleton />}>
          <GithubStats username={user.githubUsername} />
        </Suspense>
      </ErrorBoundary>
    </ThemedCard>
  );
}

function LeetcodeStatsCard({ user, theme }: any) {
  return (
    <ThemedCard themeId={theme.id} className="flex flex-col gap-4 p-6 h-full">
      <h2
        className="text-[10px] font-mono tracking-widest uppercase pb-3"
        style={{
          color: "var(--theme-text-secondary)",
          borderBottom: "1px solid var(--theme-separator)",
        }}
      >
        LeetCode
      </h2>
      <ErrorBoundary fallbackMessage="Failed to load LeetCode stats">
        <Suspense fallback={<LeetcodeStatsSkeleton />}>
          <LeetcodeStats username={user.leetcodeUsername} />
        </Suspense>
      </ErrorBoundary>
    </ThemedCard>
  );
}

function DeveloperStats({ user, theme }: any) {
  if (!user.githubUsername && !user.leetcodeUsername) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {user.githubUsername && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <GithubStatsCard user={user} theme={theme} />
        </div>
      )}
      {user.leetcodeUsername && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
          <LeetcodeStatsCard user={user} theme={theme} />
        </div>
      )}
    </div>
  );
}

function GithubCalendarCard({ user, theme }: any) {
  if (!user.githubUsername) return null;
  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
      <ThemedCard themeId={theme.id} className="flex flex-col gap-4 p-6 sm:p-8 h-full">
        <div className="flex items-center gap-2">
          <IconBrandGithub
            size={18}
            style={{ color: "var(--theme-text-secondary)" }}
          />
          <h2
            className="text-[10px] font-mono tracking-widest uppercase"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Contributions
          </h2>
        </div>
        <ErrorBoundary fallbackMessage="Failed to load GitHub calendar">
          <Suspense fallback={<GithubCalendarSkeleton />}>
            <GithubCalendar username={user.githubUsername} />
          </Suspense>
        </ErrorBoundary>
      </ThemedCard>
    </div>
  );
}

function ProjectCardUI({ project, theme }: any) {
  return (
    <ThemedCard
      themeId={theme.id}
      className="group flex flex-col justify-between p-6 min-h-[200px] h-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-full flex items-center justify-center transition-colors shrink-0"
              style={{
                background: "var(--theme-tag-bg)",
                border: `1px solid var(--theme-separator)`,
              }}
            >
              <IconCode
                size={18}
                style={{ color: "var(--theme-tag-text)" }}
              />
            </div>
            <h3
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 flex items-center justify-center rounded-full transition-colors"
                style={{
                  background: "var(--theme-tag-bg)",
                  border: `1px solid var(--theme-separator)`,
                  color: "var(--theme-text-secondary)",
                }}
              >
                <IconBrandGithub size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 flex items-center justify-center rounded-full transition-colors"
                style={{
                  background: "var(--theme-tag-bg)",
                  border: `1px solid var(--theme-separator)`,
                  color: "var(--theme-text-secondary)",
                }}
              >
                <IconExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {project.description && (
          <p
            className="text-sm leading-relaxed mt-2 line-clamp-3"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {project.description}
          </p>
        )}
      </div>

      {project.techStack && project.techStack.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 mt-6 pt-4"
          style={{ borderTop: `1px solid var(--theme-separator)` }}
        >
          {project.techStack.map((tech: string) => (
            <span
              key={tech}
              className="text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider"
              style={{
                background: "var(--theme-tag-bg)",
                border: `1px solid var(--theme-tag-border, var(--theme-separator))`,
                color:
                  (theme.cssVars as Record<string, string>)["--theme-tag-text"] ||
                  "var(--theme-text-secondary)",
                borderRadius:
                  theme.id === "neo-brutalism"
                    ? "0"
                    : theme.id === "claymorphism"
                      ? "9999px"
                      : "9999px",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </ThemedCard>
  );
}

function ProjectsSection({ projects, theme, gridClass }: any) {
  if (projects.length === 0) return null;
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2
        className="text-[10px] font-mono tracking-widest uppercase pb-3"
        style={{
          color: "var(--theme-text-secondary)",
          borderBottom: "1px solid var(--theme-separator)",
        }}
      >
        Projects
      </h2>
      <div className={gridClass}>
        {projects.map((project: any, idx: number) => (
          <div
            key={project.id}
            className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
            style={{ animationDelay: `${(idx + 5) * 100}ms` }}
          >
            <ProjectCardUI project={project} theme={theme} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlesSection({ user, theme }: any) {
  if (!user.devtoUsername && !user.mediumUsername && !user.hashnodeUsername) return null;
  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
      <ThemedCard themeId={theme.id} className="flex flex-col gap-4 p-6 sm:p-8">
        <h2
          className="text-[10px] font-mono tracking-widest uppercase pb-3"
          style={{
            color: "var(--theme-text-secondary)",
            borderBottom: `1px solid var(--theme-separator)`,
          }}
        >
          Latest Articles
        </h2>
        <div className="flex flex-col gap-6">
          {user.devtoUsername && (
            <ErrorBoundary fallbackMessage="Failed to load Dev.to posts">
              <Suspense fallback={<DevtoPostsSkeleton />}>
                <DevtoPosts username={user.devtoUsername} />
              </Suspense>
            </ErrorBoundary>
          )}
          {(user.mediumUsername || user.hashnodeUsername) && (
            <ErrorBoundary fallbackMessage="Failed to load blog posts">
              <Suspense fallback={<BlogPostsSkeleton />}>
                <BlogPosts
                  mediumUsername={user.mediumUsername ?? undefined}
                  hashnodeUsername={user.hashnodeUsername ?? undefined}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </ThemedCard>
    </div>
  );
}

/* ── Shared Themed Card Component ───────────────────────────────────────── */

function ThemedCard({
  themeId,
  className,
  children,
}: {
  themeId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const radiusMap: Record<string, string> = {
    glassmorphism: "1.5rem",
    "neo-brutalism": "0px",
    neumorphism: "1.25rem",
    claymorphism: "2rem",
  };

  return (
    <div
      className={`transition-all duration-300 ${className ?? ""}`}
      style={{
        background: "var(--theme-card-bg)",
        border: "var(--theme-card-border)",
        boxShadow: "var(--theme-card-shadow)",
        borderRadius: radiusMap[themeId] ?? "1rem",
        backdropFilter: "var(--theme-card-backdrop)",
        WebkitBackdropFilter: "var(--theme-card-backdrop)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Theme-specific Background Decorations ──────────────────────────────── */

function ThemeBackground({ themeId }: { themeId: string }) {
  if (themeId === "glassmorphism") {
    return (
      <>
        {/* Floating aurora orbs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(138, 43, 226, 0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 100, 200, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </>
    );
  }

  if (themeId === "neo-brutalism") {
    return (
      <>
        {/* Halftone dot grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1a1a1a 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Bold accent stripe top */}
        <div
          className="absolute top-0 left-0 right-0 h-2 pointer-events-none z-0"
          style={{ background: "#ff6b35" }}
        />
      </>
    );
  }

  if (themeId === "neumorphism") {
    return (
      // Subtle inner noise texture
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    );
  }

  if (themeId === "claymorphism") {
    return (
      <>
        {/* Soft pastel blob shapes */}
        <div
          className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 168, 212, 0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </>
    );
  }

  return null;
}
