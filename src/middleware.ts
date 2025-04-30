import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  const pathname = request.nextUrl.pathname

  const isLoginPage = pathname.startsWith("/login")
  const isHomePage = pathname === "/"
  const isOffersPage = pathname.startsWith("/offers")

  if (token && (isLoginPage || isHomePage)) {
    return NextResponse.redirect(new URL("/offers", request.url))
  }

  if (!token && isOffersPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/offers/:path*"]
}
