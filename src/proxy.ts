import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Define route matchers that do not require authenticated sessions
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/api/v1/health",
  "/api/v1/webhooks/clerk(.*)",
]);

export const proxy = (request: NextRequest, event: NextFetchEvent) => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  const hasPlaceholderKeys =
    !publishableKey ||
    !secretKey ||
    publishableKey.includes("xxxxxxxxxxxxxxxxxxxxxxxxxx") ||
    secretKey.includes("xxxxxxxxxxxxxxxxxxxxxxxxxx");

  if (hasPlaceholderKeys) {
    const url = new URL(request.url);
    // If request targets API endpoints, return JSON instead of HTML layout
    if (url.pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({
          error: "Identity Provider Setup Required",
          message: "Please configure valid Clerk credentials in your environment variables.",
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
    // Proceed to rendering so RootLayout can present the onboarding page
    return NextResponse.next();
  }

  // Execute standard Clerk protection middleware
  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  })(request, event);
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
