import { NextRequest, NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";
import { auth } from "./lib/auth";
import { isRole, ROLE_HOME } from "./lib/roles";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: new RegExp(`^${route}$`),
  allowedRoles: routeAccessMap[route],
}));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const role = (session?.user as { role?: string } | undefined)?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher.test(pathname)) {
      if (!role) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (!isRole(role)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
