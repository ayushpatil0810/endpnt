import { db } from "@/db/db";
import { users, links, projects } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, cache } from "react";
import { PublicLinkButton } from "./public-link-button";
import { GithubStats } from "@/components/github-stats";
import { LeetcodeStats } from "@/components/leetcode-stats";
import { DevtoPosts } from "@/components/devto-posts";
import { GithubCalendar } from "@/components/github-calendar";
import { BlogPosts } from "@/components/blog-posts";
import { ViewTracker } from "@/components/ViewTracker";
import {
  GithubStatsSkeleton,
  GithubCalendarSkeleton,
  LeetcodeStatsSkeleton,
  DevtoPostsSkeleton,
  BlogPostsSkeleton,
} from "@/components/profile-skeletons";
import { IconFileText, IconExternalLink, IconBrandGithub, IconCode } from "@tabler/icons-react";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = 60; // Cache page for 60 seconds (ISR)

/**
 * Cached per-request user lookup.
 * React's cache() deduplicates calls with the same argument within one
 * render pass, so generateMetadata and ProfilePage both calling this
 * function will only produce a single DB query.
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
      url: `https://endpnt.dev/${user.username}`,
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

  const bgOpt = user.background ?? "aurora";

  // Pre-compute background style
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
      className="min-h-dvh text-foreground flex flex-col items-center px-4 sm:px-8 py-16 sm:py-24 w-full selection:bg-foreground selection:text-background relative overflow-x-hidden"
      style={{
        backgroundColor:
          Object.keys(customBgStyle).length === 0
            ? "var(--background)"
            : undefined,
        ...customBgStyle,
      }}
    >
      <ViewTracker username={user.username} />

      {/* Decorative Backgrounds */}
      {bgOpt === "aurora" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
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

      {/* THE BENTO GRID */}
      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10 auto-rows-max grid-flow-row-dense">
        
        {/* 1. HERO IDENTITY CARD (Spans 2 cols, 2 rows) */}
        <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:row-span-2 flex flex-col items-center sm:items-start text-center sm:text-left justify-between p-8 sm:p-10 rounded-[2rem] bg-card/10 border border-border/40 backdrop-blur-md shadow-2xl hover:border-border/80 transition-all duration-500 min-h-[380px] group animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center sm:items-start gap-6 w-full">
             <div className="size-28 sm:size-32 rounded-full overflow-hidden border border-border/30 ring-[4px] ring-background/50 shadow-xl bg-card/20 group-hover:scale-105 transition-transform duration-500">
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
                 <div className="size-full flex items-center justify-center text-4xl font-serif italic text-muted-foreground bg-gradient-to-br from-card to-background">
                   {user.username.charAt(0).toUpperCase()}
                 </div>
               )}
             </div>

             <div className="flex flex-col gap-2">
               <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground normal-case leading-tight">
                  {user.username}
               </h1>
               <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                  @{user.username}
               </p>
               
               {user.bio && (
                 <p className="text-sm text-muted-foreground/90 leading-relaxed font-mono mt-3 max-w-sm">
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
                   className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-foreground text-background text-sm font-semibold hover:scale-[1.02] hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10 w-full"
                >
                   <IconFileText size={18} />
                   View Resume
                </a>
             </div>
          )}
        </div>

        {/* 2. LINK CARDS (1 col, 1 row each) */}
        {userLinks.map((link, idx) => (
           <div 
             key={link.id} 
             className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
             style={{ animationDelay: `${(idx + 1) * 100}ms` }}
           >
              <PublicLinkButton link={link} />
           </div>
        ))}

        {/* 3. GITHUB CALENDAR (Spans 2 cols, fits right next to Identity on Desktop) */}
        {user.githubUsername && (
          <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col gap-2 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
             <div className="flex items-center gap-2 mb-6">
                <IconBrandGithub size={18} className="text-muted-foreground" />
                <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                  Contributions
                </h2>
             </div>
             <Suspense fallback={<GithubCalendarSkeleton />}>
               <GithubCalendar username={user.githubUsername} />
             </Suspense>
          </div>
        )}

        {/* 4. STAT CARDS (1 col, 1 row each) */}
        {user.githubUsername && (
           <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
              <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/20 pb-3 mb-5">
                 GitHub
              </h2>
              <Suspense fallback={<GithubStatsSkeleton />}>
                 <GithubStats username={user.githubUsername} />
              </Suspense>
           </div>
        )}
        
        {user.leetcodeUsername && (
           <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
              <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/20 pb-3 mb-5">
                 LeetCode
              </h2>
              <Suspense fallback={<LeetcodeStatsSkeleton />}>
                <LeetcodeStats username={user.leetcodeUsername} />
              </Suspense>
           </div>
        )}

        {/* 5. PROJECT CARDS (Render individually into the grid) */}
        {userProjects.map((project, idx) => (
           <div 
             key={project.id} 
             className="col-span-2 md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-[2rem] bg-card/10 border border-border/40 backdrop-blur-sm hover:bg-card/20 hover:border-border/80 hover:-translate-y-1 transition-all duration-300 shadow-lg group flex flex-col justify-between min-h-[200px] animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
             style={{ animationDelay: `${(idx + 5) * 100}ms` }}
           >
              <div className="flex flex-col gap-4">
                 <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border/30 group-hover:border-foreground/20 transition-colors">
                          <IconCode size={18} className="text-foreground/70 group-hover:text-foreground transition-colors" />
                       </div>
                       <h3 className="text-lg font-semibold tracking-tight text-foreground normal-case">
                          {project.title}
                       </h3>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                       {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="size-8 flex items-center justify-center rounded-full bg-background/50 hover:bg-foreground hover:text-background text-muted-foreground transition-colors border border-border/40">
                             <IconBrandGithub size={14} />
                          </a>
                       )}
                       {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="size-8 flex items-center justify-center rounded-full bg-background/50 hover:bg-foreground hover:text-background text-muted-foreground transition-colors border border-border/40">
                             <IconExternalLink size={14} />
                          </a>
                       )}
                    </div>
                 </div>

                 {project.description && (
                    <p className="text-sm text-muted-foreground/80 leading-relaxed normal-case mt-2 line-clamp-3">
                       {project.description}
                    </p>
                 )}
              </div>

              {project.techStack && project.techStack.length > 0 && (
                 <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border/20">
                    {project.techStack.map((tech) => (
                       <span key={tech} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-border/40 bg-foreground/[0.03] text-muted-foreground uppercase tracking-wider">
                          {tech}
                       </span>
                    ))}
                 </div>
              )}
           </div>
        ))}

        {/* 6. ARTICLES (Spans 2 cols) */}
        {(user.devtoUsername || user.mediumUsername || user.hashnodeUsername) && (
           <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
              <h2 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase border-b border-border/20 pb-3 mb-6">
                 Latest Articles
              </h2>
              <div className="flex flex-col gap-6">
                 {user.devtoUsername && (
                    <Suspense fallback={<DevtoPostsSkeleton />}>
                       <DevtoPosts username={user.devtoUsername} />
                    </Suspense>
                 )}
                 {(user.mediumUsername || user.hashnodeUsername) && (
                    <Suspense fallback={<BlogPostsSkeleton />}>
                       <BlogPosts mediumUsername={user.mediumUsername ?? undefined} hashnodeUsername={user.hashnodeUsername ?? undefined} />
                    </Suspense>
                 )}
              </div>
           </div>
        )}

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
