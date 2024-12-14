import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/Home",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth(); // Check authentication status
  const url = request.nextUrl; // Get the current URL

  // Redirect authenticated users from `/` to `/Home`
  if (userId && url.pathname === "/") {
    url.pathname = "/Home";
    return NextResponse.redirect(url);
  }

  // Protect non-public routes
  if (!isPublicRoute(request) && !userId) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Allow requests to proceed if no conditions matched
});

export const config = {
  matcher: [
    // Apply middleware to all routes except static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Include API routes
    "/(api|trpc)(.*)",
  ],
};
