import { db } from "@/db/db";
import { users, links, projects } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { getTheme } from "@/lib/themes";
import dynamic from "next/dynamic";

const ViewTracker = dynamic(
  () => import("@/components/ViewTracker").then((mod) => mod.ViewTracker)
);

import {
  SidebarLayout,
  BentoLayout,
  MinimalLayout,
  ThemeBackground,
  ProfileFooter,
} from "@/components/profile";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

// ── Data layer ─────────────────────────────────────────────────────────────────

/** Cached per-request so `generateMetadata` and the page don't double-fetch. */
const getUserByUsername = cache(async (username: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user ?? null;
});

// ── ISR ────────────────────────────────────────────────────────────────────────

export const revalidate = 60;

// ── Metadata ───────────────────────────────────────────────────────────────────

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
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://endpnt.dev"}/${user.username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: profileUrl,
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

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) notFound();

  // Fetch links and projects in parallel — they're independent queries.
  const [userLinks, userProjects] = await Promise.all([
    db
      .select()
      .from(links)
      .where(eq(links.userId, user.id))
      .orderBy(asc(links.displayOrder)),
    db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(asc(projects.displayOrder)),
  ]);

  const theme = getTheme(user.theme);
  const layout = user.layout ?? "sidebar";

  return (
    <div
      data-theme={theme.id}
      className={`min-h-dvh flex flex-col items-center px-4 sm:px-8 py-16 sm:py-24 w-full relative overflow-x-hidden selection:bg-foreground/20 ${theme.pageClasses}`}
      style={{
        ...(theme.cssVars as React.CSSProperties),
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

      <ProfileFooter />
    </div>
  );
}
