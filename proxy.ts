import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes you want protected:
const isProtectedRoute = createRouteMatcher(["/journal(.*)", "/new-user(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth();
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  if (isAuthRoute(req) && isAuthenticated) {
    return Response.redirect(new URL("/journal", req.url));
  }
});

export const config = {
  matcher: [
    // Runs middleware for all page & API requests except static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
