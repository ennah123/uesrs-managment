import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export function setTokenCookie(token: string) {
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 10, // 1 hour
    path: '/',
  });

  return new NextResponse(
    JSON.stringify({ message: 'Token set successfully' }),
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    }
  );
}

export function clearTokenCookie() {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  return new NextResponse(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
