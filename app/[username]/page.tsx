import { db } from "@/db/db";
import { users, links, projects } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PublicLinkButton } from "./public-link-button";
import { GithubStats } from "@/components/github-stats";
import { LeetcodeStats } from "@/components/leetcode-stats";
import { DevtoPosts } from "@/components/devto-posts";
import { GithubCalendar } from "@/components/github-calendar";
import { BlogPosts } from "@/components/blog-posts";
import { FeaturedProjects } from "@/components/featured-projects";
import { ViewTracker } from "@/components/ViewTracker";
import {
  GithubStatsSkeleton,
  GithubCalendarSkeleton,
  LeetcodeStatsSkeleton,
  DevtoPostsSkeleton,
  BlogPostsSkeleton,
  FeaturedProjectsSkeleton,
} from "@/components/profile-skeletons";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = 60; // Cache page for 60 seconds (ISR) to prevent DB overload if a profile goes viral

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) return { title: "Not Found" };

  const title = user.seoTitle || `@${user.username} | Endpoint`;
  const description =
    user.seoDescription ||
    user.bio ||
    `Check out ${user.username}'s links on Endpoint`;
  const ogImageUrl = `/api/og?username=${user.username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://endpnt.dev/${user.username}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
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

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

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

  const bgOpt = user.background ?? "aurora";

  // Pre-compute background style if it's solid or gradient
  let customBgStyle: React.CSSProperties = {};
  if (bgOpt.startsWith("#")) {
    customBgStyle = { backgroundColor: bgOpt };
  } else if (bgOpt.startsWith("solid:")) {
    customBgStyle = { backgroundColor: bgOpt.replace("solid:", "") };
  } else if (bgOpt.startsWith("gradient:")) {
    customBgStyle = { background: bgOpt.replace("gradient:", "") };
  }

  return (
    <div
      className="min-h-dvh text-foreground flex flex-col items-center px-6 py-24 sm:py-32 w-full selection:bg-foreground selection:text-background relative overflow-hidden"
      style={{
        backgroundColor:
          Object.keys(customBgStyle).length === 0
            ? "var(--background)"
            : undefined,
        ...customBgStyle,
      }}
    >
      <ViewTracker username={user.username} />

      {bgOpt === "aurora" && (
        <div
          className="aurora-bg absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, rgba(138, 43, 226, 0.15), transparent 50%),
            radial-gradient(ellipse 80% 50% at 20% 10%, rgba(0, 255, 255, 0.1), transparent 60%),
            radial-gradient(ellipse 90% 60% at 80% 0%, rgba(255, 215, 0, 0.05), transparent 65%),
            #00000000
          `,
          }}
        />
      )}

      {bgOpt === "grid" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "2rem 2rem",
          }}
        />
      )}

      {bgOpt === "dots" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(var(--foreground) 1px, transparent 1px)",
            backgroundSize: "1.5rem 1.5rem",
          }}
        />
      )}

      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24 relative z-10 px-4 sm:px-8">
        {/* Header Section (Left on Desktop) */}
        <header className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:sticky lg:top-32 lg:w-[350px] shrink-0 w-full">
          <div className="size-28 sm:size-32 rounded-full overflow-hidden border border-border/30 ring-4 ring-background/50 shadow-2xl bg-card/20 backdrop-blur-sm">
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
              <div className="size-full flex items-center justify-center text-5xl font-serif italic text-muted-foreground">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground uppercase">
              @{user.username}
            </h1>

            {user.bio && (
              <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed max-w-sm lg:max-w-full mx-auto lg:mx-0 font-mono tracking-wide px-4 lg:px-0">
                {user.bio}
              </p>
            )}
          </div>

          {(user.githubUsername || user.leetcodeUsername) && (
            <div className="w-full flex flex-col gap-4 mt-2">
              <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2">
                Developer Stats
              </h2>
              {user.githubUsername && (
                <div className="flex flex-col gap-4">
                  <Suspense fallback={<GithubStatsSkeleton />}>
                    <GithubStats username={user.githubUsername} />
                  </Suspense>
                  <Suspense fallback={<GithubCalendarSkeleton />}>
                    <GithubCalendar username={user.githubUsername} />
                  </Suspense>
                </div>
              )}
              {user.leetcodeUsername && (
                <Suspense fallback={<LeetcodeStatsSkeleton />}>
                  <LeetcodeStats username={user.leetcodeUsername} />
                </Suspense>
              )}
            </div>
          )}
        </header>

        {/* Links Section (Right on Desktop) */}
        <main className="flex-1 w-full flex flex-col gap-4">
          {userProjects.length > 0 && (
            <Suspense fallback={<FeaturedProjectsSkeleton />}>
              <FeaturedProjects projects={userProjects} />
            </Suspense>
          )}

          {user.devtoUsername && (
            <Suspense fallback={<DevtoPostsSkeleton />}>
              <DevtoPosts username={user.devtoUsername} />
            </Suspense>
          )}

          {(user.mediumUsername || user.hashnodeUsername) && (
            <Suspense fallback={<BlogPostsSkeleton />}>
              <BlogPosts
                mediumUsername={user.mediumUsername ?? undefined}
                hashnodeUsername={user.hashnodeUsername ?? undefined}
              />
            </Suspense>
          )}

          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2">
              All Links
            </h2>

            {userLinks.length === 0 && (
              <div className="py-16 text-center text-xs sm:text-sm font-mono tracking-widest text-muted-foreground uppercase border border-dashed border-border/40 rounded-3xl bg-card/5 backdrop-blur-sm">
                No links yet.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {userLinks.map((link) => (
                <PublicLinkButton key={link.id} link={link} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 pb-12 w-full flex flex-col items-center gap-4 text-[11px] font-mono tracking-widest text-muted-foreground uppercase relative z-10">
        <div className="w-12 h-px bg-border/40" />
        <Link
          href="/"
          className="hover:text-foreground font-bold transition-colors text-foreground/80 flex items-center gap-2"
        >
          Endpoint
        </Link>
      </footer>
    </div>
  );
}
