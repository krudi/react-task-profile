import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
    const session = getSessionCookie(request);

    if (session && request.nextUrl.pathname.startsWith('/auth/sign-in')) {
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    const protectedPaths = [/^\/profile(\/.*)?$/];
    if (
        !session &&
        protectedPaths.some((pattern) => pattern.test(request.nextUrl.pathname))
    ) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/sign-in',
        '/profile/:path*',
        '/_next/static/:path*',
        '/_next/image/:path*',
    ],
};
