import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const { pathname, search } = req.nextUrl;

    // Public routes
    const publicRoutes = ["/", "/login", "/signup"];

    if (publicRoutes.includes(pathname)) {
      // Already logged in -> don't show login/signup again
      if (token && (pathname === "/login" || pathname === "/signup")) {
        const from = req.nextUrl.searchParams.get("from");
        return NextResponse.redirect(new URL(from || "/dashboard", req.url));
      }

      return NextResponse.next();
    }

    // Not authenticated
    if (!token) {
      const from = pathname + search;

      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // IMPORTANT: Let the proxy decide redirects.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all pages except:
     * - API routes
     * - Next.js internals
     * - Static files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};