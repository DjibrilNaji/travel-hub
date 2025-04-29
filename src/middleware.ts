import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  const isLoginPage = request.nextUrl.pathname.startsWith("/login")
  const isHomePage = request.nextUrl.pathname === "/"

  if (token && (isLoginPage || isHomePage)) {
    return NextResponse.redirect(new URL("/offers", request.url))
  }

  if (!token && request.nextUrl.pathname.startsWith("/offers")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next() // laisser passer sinon
}

export const config = {
  matcher: ["/", "/login", "/offers"]
}
