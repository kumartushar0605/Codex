import { NextResponse } from 'next/server';

export function middleware(request) {
  // Admin routes are now handled by client-side authentication
  // The AdminContext will handle session verification and redirects
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
