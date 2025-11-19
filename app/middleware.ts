import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { SESSION_COOKIE } from "@/lib/session"

export function middleware(request: NextRequest) {
  const userId = request.cookies.get(SESSION_COOKIE)?.value

  if (!userId) {
    const loginUrl = new URL("/", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
