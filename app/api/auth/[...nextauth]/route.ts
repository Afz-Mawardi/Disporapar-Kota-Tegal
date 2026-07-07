import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = (req: Request, ctx: any) => {
  if (process.env.NODE_ENV === 'development') {
    const host = req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    if (host) {
      process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
  }
  return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };
