import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const maintenanceAllowedPaths = [
  '/admin',
  '/api/admin',
  '/api/auth',
  '/auth/signin',
  '/auth',
  '/maintenance',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export default withAuth(
  function middleware(req) {
    if (process.env.MAINTENANCE_MODE === 'true') {
      const path = req.nextUrl.pathname;
      const isAllowed = maintenanceAllowedPaths.some(p => path === p || path.startsWith(p + '/'));
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin')) return token?.role === 'admin';
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
