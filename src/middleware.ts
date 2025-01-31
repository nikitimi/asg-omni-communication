import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/connect(.*)"]);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId === null && isProtectedRoute(req)) {
    return NextResponse.redirect(
      new URL("/sign-in", process.env.NEXT_PUBLIC_WEB_ORIGIN)
    );
  }
  if (typeof userId === "string" && isPublicRoute(req)) {
    return NextResponse.redirect(
      new URL("/connect", process.env.NEXT_PUBLIC_WEB_ORIGIN)
    );
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
