import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/journal(.*)", "/new-user(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const data = await auth();
    const { isAuthenticated, sessionId } = data;

    console.log("Middleware auth check:", { isAuthenticated, sessionId });

    if (isProtectedRoute(req)) {
      await auth.protect();
    }

    if (isAuthRoute(req) && isAuthenticated) {
      return Response.redirect(new URL("/journal", req.url));
    }
  } catch (err: any) {
    console.error("Middleware error:", err);
    throw err;
  }
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
