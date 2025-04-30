import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
debugger
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  console.log(token);
  console.log(role)
  if (!token) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (pathname.startsWith('/client') && role === 'dev') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dev') && role === 'client') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/client/:path*', '/dev/:path*'],
};