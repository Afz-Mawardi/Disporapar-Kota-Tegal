import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayoutClient from '@/app/admin/layout.client';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;
  const username = session?.user?.name || '';

  return (
    <AdminLayoutClient isLoggedIn={isLoggedIn} username={username}>
      {children}
    </AdminLayoutClient>
  );
}
