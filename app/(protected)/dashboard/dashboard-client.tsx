"use client";

import { useState, useCallback, useEffect, useRef, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { ProfileHeader } from "@/components/ProfileHeader";
import { LinkCard } from "@/components/LinkCard";
import { LinkForm } from "@/components/LinkForm";
import { ThemePicker } from "@/components/ThemePicker";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ShareModal } from "@/components/ShareModal";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, Link as DbLink } from "@/db/schema/schema";
import { motion, AnimatePresence } from "framer-motion";
import { IconSun, IconMoon } from "@tabler/icons-react";

interface DashboardClientProps {
  user: User;
  initialLinks: DbLink[];
  authUser: { name: string; image: string | null };
}

type DashboardTheme = "dark" | "light";

const DASHBOARD_THEME_STORAGE_KEY = "endpnt-dashboard-theme";

const DASHBOARD_LIGHT_THEME_VARS = {
  "--background": "oklch(0.985 0 0)",
  "--foreground": "oklch(0.13 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.13 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.13 0 0)",
  "--primary": "oklch(0.13 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.96 0 0)",
  "--secondary-foreground": "oklch(0.13 0 0)",
  "--muted": "oklch(0.96 0 0)",
  "--muted-foreground": "oklch(0.45 0 0)",
  "--accent": "oklch(0.96 0 0)",
  "--accent-foreground": "oklch(0.13 0 0)",
  "--destructive": "oklch(0.58 0.24 27)",
  "--destructive-foreground": "oklch(1 0 0)",
  "--border": "oklch(0.9 0 0)",
  "--input": "oklch(0.92 0 0)",
  "--ring": "oklch(0.7 0 0)",
  "--sidebar": "oklch(0.98 0 0)",
  "--sidebar-foreground": "oklch(0.13 0 0)",
  "--sidebar-primary": "oklch(0.13 0 0)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.96 0 0)",
  "--sidebar-accent-foreground": "oklch(0.13 0 0)",
  "--sidebar-border": "oklch(0.9 0 0)",
  "--sidebar-ring": "oklch(0.7 0 0)",
} as const;

export function DashboardClient({
  user,
  initialLinks,
  authUser,
}: DashboardClientProps) {
  const router = useRouter();
  const [links, setLinks] = useState<DbLink[]>(initialLinks);
  const [bio, setBio] = useState(user.bio ?? "");
  const [githubUsername, setGithubUsername] = useState(
    user.githubUsername ?? "",
  );
  const [leetcodeUsername, setLeetcodeUsername] = useState(
    user.leetcodeUsername ?? "",
  );
  const [devtoUsername, setDevtoUsername] = useState(user.devtoUsername ?? "");
  const [seoTitle, setSeoTitle] = useState(user.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    user.seoDescription ?? "",
  );
  const [avatarUrl] = useState(user.avatarUrl ?? authUser.image ?? null);
  const [background, setBackground] = useState(user.background ?? "aurora");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [dashboardTheme, setDashboardTheme] = useState<DashboardTheme>("dark");
  const [isThemeReady, setIsThemeReady] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("add-new-link-btn")?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const btn = toggleBtnRef.current;
    const isGoingLight = dashboardTheme === "dark";
    const newTheme: DashboardTheme = isGoingLight ? "light" : "dark";

    if (!document.startViewTransition) {
      setDashboardTheme(newTheme);
      return;
    }

    // Calculate origin and max radius
    const x = btn ? btn.getBoundingClientRect().left + btn.offsetWidth / 2 : window.innerWidth / 2;
    const y = btn ? btn.getBoundingClientRect().top + btn.offsetHeight / 2 : window.innerHeight / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setDashboardTheme(newTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ];
      
      document.documentElement.animate(
        {
          clipPath: isGoingLight ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: isGoingLight
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  }, [dashboardTheme]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleLinkAdded(newLink: DbLink) {
    setLinks((prev) => [...prev, newLink]);
  }

  function handleLinkUpdated(updated: DbLink) {
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  function handleLinkDeleted(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const reordered = arrayMove(links, oldIndex, newIndex).map((link, idx) => ({
      ...link,
      displayOrder: idx,
    }));

    setLinks(reordered);

    // Persist reorder
    try {
      const res = await fetch("/api/links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: reordered.map((l) => ({
            id: l.id,
            displayOrder: l.displayOrder,
          })),
        }),
      });
      if (!res.ok) throw new Error("Sync failed");
    } catch {
      toast.error("Failed to save order.");
    }
  }

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
  }, [router]);

  const [origin, setOrigin] = useState("https://endpnt.dev");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(
      DASHBOARD_THEME_STORAGE_KEY,
    );
    if (storedTheme === "light" || storedTheme === "dark") {
      setDashboardTheme(storedTheme);
    }
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    if (!isThemeReady) return;
    window.localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, dashboardTheme);
  }, [dashboardTheme, isThemeReady]);

  const dashboardThemeStyle: CSSProperties =
    dashboardTheme === "light"
      ? ({
          ...DASHBOARD_LIGHT_THEME_VARS,
          colorScheme: "light",
        } as CSSProperties)
      : ({ colorScheme: "dark" } as CSSProperties);

  const profileUrl = `${origin}/${user.username}`;

  const handleIntegrationSave = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUsername,
          leetcodeUsername,
          devtoUsername,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Integrations updated!");
    } catch {
      toast.error("Failed to update integrations");
    }
  }, [githubUsername, leetcodeUsername, devtoUsername]);

  const handleSeoSave = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seoTitle, seoDescription }),
      });
      if (!res.ok) throw new Error("Failed to save SEO");
      toast.success("SEO settings updated!");
    } catch {
      toast.error("Failed to update SEO settings");
    }
  }, [seoTitle, seoDescription]);

  return (
    <div
      data-dashboard-theme={dashboardTheme}
      className="min-h-dvh bg-background flex flex-col uppercase selection:bg-primary/20"
      style={dashboardThemeStyle}
    >
      {/* Top Nav */}
      <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="font-bold text-sm tracking-widest text-foreground">
          endpnt.
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Sun / Moon toggle */}
          <button
            ref={toggleBtnRef}
            aria-label="Toggle theme"
            onClick={handleThemeToggle}
            className="relative flex items-center justify-center size-9 rounded-full border border-border/50 bg-card/40 hover:bg-card/80 text-foreground transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {dashboardTheme === "dark" ? (
                <motion.span
                  key="moon"
                  initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute flex items-center justify-center"
                >
                  <IconMoon size={15} stroke={1.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ rotate: 30, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -30, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute flex items-center justify-center"
                >
                  <IconSun size={15} stroke={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="text-[10px] uppercase font-mono tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/20 px-4 py-2 rounded-full"
          >
            Share
          </button>
          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            View profile
          </a>
          <button
            onClick={handleSignOut}
            className="text-xs font-medium tracking-wide text-muted-foreground hover:text-destructive transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Profile & Settings */}
          <div className="lg:col-span-4 flex flex-col gap-16 sticky top-32">
            {/* Profile URL Banner - Extremely flat */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 border-b border-border/60 pb-8"
            >
              <div className="text-[10px] font-mono tracking-widest text-muted-foreground text-left">
                YOUR ENDPNT URL
              </div>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-xl sm:text-2xl tracking-tight text-foreground hover:text-muted-foreground transition-colors break-all normal-case"
                >
                  {profileUrl.replace("https://", "")}
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileUrl);
                    toast.success("Copied to clipboard!");
                  }}
                  className="text-[10px] font-mono tracking-widest text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap pb-1"
                >
                  COPY
                </button>
              </div>
            </motion.div>

            {/* Profile header */}
            <motion.section
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ProfileHeader
                username={user.username}
                bio={bio}
                avatarUrl={avatarUrl}
                onBioUpdate={(newBio) => setBio(newBio)}
              />
            </motion.section>

            {/* Developer Integrations */}
            <motion.section
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
                  Dev Stats
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="github"
                    className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1"
                  >
                    GitHub Username
                  </label>
                  <input
                    id="github"
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. torvalds"
                    className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-xl px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="leetcode"
                    className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1"
                  >
                    LeetCode Username
                  </label>
                  <input
                    id="leetcode"
                    type="text"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    placeholder="e.g. neetcode"
                    className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-xl px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label
                  htmlFor="devto"
                  className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1"
                >
                  Dev.to Username (Blog)
                </label>
                <input
                  id="devto"
                  type="text"
                  value={devtoUsername}
                  onChange={(e) => setDevtoUsername(e.target.value)}
                  placeholder="e.g. ben"
                  className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-xl px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleIntegrationSave}
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-colors"
                >
                  Save Config
                </button>
              </div>
            </motion.section>

            {/* Custom SEO Settings */}
            <motion.section
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground whitespace-nowrap">
                  SEO & Social
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="seoTitle"
                    className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1"
                  >
                    Meta Title
                  </label>
                  <input
                    id="seoTitle"
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. John Doe - Full-stack Engineer"
                    className="w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-xl px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="seoDescription"
                    className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1"
                  >
                    Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="e.g. Check out my latest articles and source code."
                    className="w-full min-h-24 resize-none bg-card/20 border border-border/60 hover:border-foreground/40 rounded-xl px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSeoSave}
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-colors"
                >
                  Save SEO
                </button>
              </div>
            </motion.section>

            {/* Background picker */}
            <motion.section
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ThemePicker
                currentBackground={background}
                onBackgroundChange={setBackground}
              />
            </motion.section>
          </div>

          {/* Right Column: Links Management & Analytics */}
          <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-16">
            {/* Analytics Dashboard */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <AnalyticsDashboard views={user.views ?? 0} links={links} />
            </motion.section>

            {/* Links Editor */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-between border-b border-border/60 pb-6"
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-foreground">
                Your Links
              </h2>
              <div className="text-xs font-mono text-muted-foreground">
                {links.length} {links.length === 1 ? "link" : "links"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <DndContext
                id="dashboard-dnd-context"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={links.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col">
                    {links.map((link) => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        onUpdate={handleLinkUpdated}
                        onDelete={handleLinkDeleted}
                      />
                    ))}

                    {links.length === 0 && (
                      <div className="py-16 text-center border-b border-border/40">
                        <p className="text-muted-foreground/60 text-sm font-medium tracking-wide normal-case">
                          No links yet. Add your first link below.
                        </p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-8">
                <LinkForm onLinkAdded={handleLinkAdded} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileUrl={profileUrl}
        username={user.username}
      />
    </div>
  );
}
