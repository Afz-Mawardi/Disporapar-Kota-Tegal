import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin - DISPORAPAR Kota Tegal',
};

export default function LoginAdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
