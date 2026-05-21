import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const protectedRoutes = ["/dashboard", "/onboarding"];

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const rateLimiters = redis ? {
  publicProfile: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 s") }),
  analytics: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "10 s") }),
  click: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "10 s") }),
  auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 s") })
} : null;

/**
 * Next.js 16+ Proxy
 * Note: 'middleware.ts' was deprecated and renamed to 'proxy.ts' in Next.js 16.
 * This file handles authentication and routing logic before requests complete.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";

  // Rate Limiting
  if (rateLimiters) {
    if (pathname.startsWith("/api/auth/")) {
      const { success } = await rateLimiters.auth.limit(ip);
      if (!success) return new NextResponse("Too Many Requests", { status: 429 });
    } else if (pathname === "/api/profile/view") {
      const { success } = await rateLimiters.analytics.limit(ip);
      if (!success) return new NextResponse("Too Many Requests", { status: 429 });
    } else if (pathname.startsWith("/api/links/") && pathname.endsWith("/click")) {
      const { success } = await rateLimiters.click.limit(ip);
      if (!success) return new NextResponse("Too Many Requests", { status: 429 });
    } else if (
      pathname !== "/" && 
      !pathname.startsWith("/api/") && 
      !pathname.startsWith("/_next/") &&
      !pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/onboarding") &&
      !pathname.startsWith("/sign-in") &&
      !pathname.startsWith("/sign-up")
    ) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length === 1) {
        const { success } = await rateLimiters.publicProfile.limit(ip);
        if (!success) return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
  }

  // Authentication
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
