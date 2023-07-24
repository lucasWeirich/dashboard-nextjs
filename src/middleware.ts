import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    const redirectURL = new URL('/login', req.url)
    return NextResponse.redirect(redirectURL)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/panel/:path*',
    '/products/:path*',
    '/orders/:path*',
    '/orders/:path*',
    '/sales/:path*',
    '/report/:path*',
    '/settings/:path*',
  ]
}
