import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';
import crypto from 'crypto';
import { logAudit } from '@/lib/audit';

// In-memory rate limiter for login
const loginAttempts = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const ip = (req?.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'Unknown IP';
        const username = credentials?.username || 'Unknown';

        // Rate Limiter Check
        const now = Date.now();
        const attempt = loginAttempts.get(ip);
        if (attempt) {
          if (now < attempt.resetTime) {
            if (attempt.count >= MAX_ATTEMPTS) {
              await logAudit({ user: username, ip: ip as string, endpoint: '/api/auth/login', action: 'Login diblokir (Brute-force)', status: 'Gagal' });
              throw new Error('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
            }
          } else {
            loginAttempts.delete(ip); // Reset if window passed
          }
        }

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Query the admin user from MySQL database
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            // Register failed attempt
            const currentAttempt = loginAttempts.get(ip) || { count: 0, resetTime: now + WINDOW_MS };
            currentAttempt.count += 1;
            loginAttempts.set(ip, currentAttempt);
            await logAudit({ user: credentials.username, ip: ip as string, endpoint: '/api/auth/login', action: 'Login', status: 'Gagal', details: { reason: 'User not found' } });
            return null;
          }

          let isValidPassword = false;

          // Check if password is already hashed with Argon2
          if (user.password.startsWith('$argon2')) {
            isValidPassword = await argon2.verify(user.password, credentials.password);
          } else {
            // Legacy MD5 check
            const md5Password = crypto.createHash('md5').update(credentials.password).digest('hex');
            if (md5Password === user.password) {
              isValidPassword = true;

              // Transparent Migration: Hash with Argon2 and update DB
              const newArgon2Hash = await argon2.hash(credentials.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1
              });

              await prisma.user.update({
                where: { id: user.id },
                data: { password: newArgon2Hash }
              });

              await logAudit({ user: user.username, ip: ip as string, endpoint: '/api/auth/login', action: 'Password Migration to Argon2', status: 'Berhasil' });
            }
          }

          if (!isValidPassword) {
            // Register failed attempt
            const currentAttempt = loginAttempts.get(ip) || { count: 0, resetTime: now + WINDOW_MS };
            currentAttempt.count += 1;
            loginAttempts.set(ip, currentAttempt);
            await logAudit({ user: user.username, ip: ip as string, endpoint: '/api/auth/login', action: 'Login', status: 'Gagal', details: { reason: 'Invalid password' } });
            return null;
          }

          // Clear attempts on success
          loginAttempts.delete(ip);

          await logAudit({ user: user.username, ip: ip as string, endpoint: '/api/auth/login', action: 'Login', status: 'Berhasil' });

          return {
            id: user.id,
            name: user.username,
            email: user.username,
            role: (user as any).role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 10 * 60 // 10 menit sesi (idle timeout)
  },
  pages: {
    signIn: '/login.admin',
    error: '/login.admin'
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
  // Ensure strict environment secret loading without fallback
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut(message) {
      await logAudit({
        user: (message.token as any)?.username || 'Unknown',
        ip: 'Sistem',
        endpoint: '/api/auth/signout',
        action: 'Logout',
        status: 'Berhasil'
      });
    }
  }
};
