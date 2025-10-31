import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the SHOW_COMING_SOON environment variable
  const showComingSoon = process.env.SHOW_COMING_SOON === "false"

  // Skip redirecting for the coming-soon page itself and for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Redirect to coming soon page if the flag is true
  if (showComingSoon) {
    return NextResponse.redirect(new URL("/coming-soon", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
