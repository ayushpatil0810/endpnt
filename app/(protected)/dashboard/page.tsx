import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { users, links } from "@/db/schema/schema";
import { eq, asc } from "drizzle-orm";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has set a username
  const [userProfile] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!userProfile) {
    redirect("/onboarding");
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, session.user.id))
    .orderBy(asc(links.displayOrder));

  return (
    <DashboardClient
      user={userProfile}
      initialLinks={userLinks}
      authUser={{ name: session.user.name, image: session.user.image ?? null }}
    />
  );
}
