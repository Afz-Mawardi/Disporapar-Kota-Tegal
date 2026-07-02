import { prisma } from '@/lib/prisma';
import ProfilPageClient from './page.client';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const welcomeMessage = await prisma.welcomeMessage.findUnique({
    where: { id: 'default' }
  });

  return (
    <ProfilPageClient
      initialWelcomeMessage={welcomeMessage || undefined}
    />
  );
}
