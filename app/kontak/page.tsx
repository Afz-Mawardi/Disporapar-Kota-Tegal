import { prisma } from '@/lib/prisma';
import KontakPageClient from './KontakPageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const officeInfoDb = await prisma.officeInfo.findUnique({
    where: { id: 'default' }
  });

  let officeInfo = null;
  if (officeInfoDb) {
    let socialMediaList: any[] = [];
    if (officeInfoDb.instagramResmi && officeInfoDb.instagramResmi.startsWith('[')) {
      try {
        socialMediaList = JSON.parse(officeInfoDb.instagramResmi);
      } catch (e) {
        console.error('Failed to parse socialMediaList JSON', e);
      }
    }

    if (socialMediaList.length === 0) {
      socialMediaList = [
        { platform: 'instagram', label: 'Resmi', url: (officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) ? officeInfoDb.instagramResmi : '' },
        { platform: 'instagram', label: 'Wisata', url: officeInfoDb.instagramTourism || '' },
        { platform: 'instagram', label: 'Pemuda', url: officeInfoDb.instagramPemuda || '' },
        { platform: 'youtube', label: 'YouTube', url: officeInfoDb.youtube || '' }
      ].filter(item => item.url !== '');
    }

    officeInfo = {
      address: officeInfoDb.address,
      phone: officeInfoDb.phone,
      email: officeInfoDb.email,
      operationalHours: officeInfoDb.operationalHours,
      socialMedia: {
        instagramResmi: (officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) ? officeInfoDb.instagramResmi : (socialMediaList.find(s => s.platform === 'instagram' && s.label === 'Resmi')?.url || ''),
        instagramTourism: officeInfoDb.instagramTourism,
        instagramPemuda: officeInfoDb.instagramPemuda,
        youtube: officeInfoDb.youtube
      },
      gmapsEmbedUrl: officeInfoDb.gmapsEmbedUrl,
      socialMediaList: socialMediaList
    };
  }

  return (
    <KontakPageClient
      initialOfficeInfo={officeInfo || undefined}
    />
  );
}
