import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Return standard Next.js response to allow the request
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If the token exists, they are authenticated
        return !!token;
      }
    }
  }
);

export const config = {
  // Protect all admin API routes and frontend admin pages
  // Adjust paths based on the actual sensitive routes
  matcher: [
    '/api/admins/:path*',
    '/admin/:path*'
  ]
};
