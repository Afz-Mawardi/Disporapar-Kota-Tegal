import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayoutClient from '@/app/admin/layout.client';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - DISPORAPAR Kota Tegal',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login.admin');
  }

  const username = session?.user?.name || '';
  const role = (session?.user as any)?.role || 'ADMIN';

  return (
    <AdminLayoutClient isLoggedIn={true} username={username} role={role}>
      {children}
    </AdminLayoutClient>
  );
}
