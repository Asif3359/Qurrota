import { NextRequest, NextResponse } from 'next/server';

// We only protect client-side pages lightly here because auth is stored in cookies/session.
// This middleware reads a lightweight cookie to decide access to dashboard routes.

const AUTH_USER_KEY = 'authUser';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get(AUTH_USER_KEY)?.value;
  if (!userCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const user = JSON.parse(userCookie || '{}') as { role?: string };
    const role = user.role || 'user';

    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname.startsWith('/dashboard/moderator') && role !== 'moderator') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname.startsWith('/dashboard/user') && role !== 'user') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch {}

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


