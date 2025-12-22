import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes you want protected:
const isProtectedRoute = createRouteMatcher(["/journal(.*)", "/new-user(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // If trying to access a *protected route*, enforce authentication
  if (isProtectedRoute(req)) {
    await auth.protect(); // redirects to sign-in if not signed in
  }
});

export const config = {
  matcher: [
    // Runs middleware for all page & API requests except static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
