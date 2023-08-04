import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  //routes that don't require authentication.
  publicRoutes: ["/", "/api/webhook/clerk"],

  //ignored by the authentication middleware.
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
