import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const maintenanceAllowedPaths = [
  '/admin',
  '/api/admin',
  '/api/auth',
  '/api/settings',
  '/auth/signin',
  '/auth',
  '/maintenance',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;

    if (path.startsWith('/api/settings')) {
      return NextResponse.next();
    }

    try {
      const res = await fetch(`${req.nextUrl.origin}/api/settings/maintenance`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.maintenanceMode === true) {
          const isAllowed = maintenanceAllowedPaths.some(p => path === p || path.startsWith(p + '/'));
          if (!isAllowed) {
            return NextResponse.redirect(new URL('/maintenance', req.url));
          }
        }
      }
    } catch {
      // If settings fetch fails, proceed normally
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
          return token?.role === 'admin';
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
