import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the request is for admin routes
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/admin')) {
    // Check for admin query parameter (will be set by client-side)
    const adminCheck = request.nextUrl.searchParams.get('admin');
    
    // If no admin parameter, redirect to unauthorized page
    if (!adminCheck) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
