import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Query the admin user from MySQL database
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          return null;
        }

        // Validate password using MD5
        const crypto = require('crypto');
        const md5Password = crypto.createHash('md5').update(credentials.password).digest('hex');
        if (md5Password !== user.password) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.username,
          role: (user as any).role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 20 * 60 // 20 minutes session (idle timeout)
  },
  pages: {
    signIn: '/admin',
    error: '/admin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.name;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'f38ad8ec7f96b9967114b0b1464ee8c4d115456fef38f15891469e38d77bfdbf'
};
