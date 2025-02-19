import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { REFRESH_TOKEN_KEY } from '@/app/auth/_model/auth.constants';
import { CLIENT_MAP } from '@/common/constants/client-map';

export function middleware(req: NextRequest) {
    const token = req.cookies.get(REFRESH_TOKEN_KEY)?.value;
    const isAuthPage = req.nextUrl.pathname.startsWith(CLIENT_MAP.AUTH.ROOT);

    if (process.env.NODE_ENV === 'development') {
        return NextResponse.next();
    }

    if (!token) {
        if (!isAuthPage) {
            return NextResponse.redirect(new URL(CLIENT_MAP.AUTH.LOGIN, req.url));
        }
    } else {
        if (isAuthPage) {
            return NextResponse.redirect(new URL(CLIENT_MAP.ROOT, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/auth/:path*'],
};