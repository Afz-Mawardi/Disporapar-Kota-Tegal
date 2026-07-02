import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import KontakPageClient from './page.client';
import dbData from '@/lib/db.json';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let officeInfoDb: any = null;
  
  if (await checkDatabaseConnection()) {
    try {
      officeInfoDb = await prisma.officeInfo.findUnique({
        where: { id: 'default' }
      });
    } catch (error) {
      console.warn("Database connection failed, falling back to local json storage:", error);
    }
  }

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
      const defaultOfficeInfo = dbData.officeInfo || {};
      const defaultList = defaultOfficeInfo.socialMediaList || [];
      socialMediaList = defaultList.map((item: any) => {
        let url = item.url;
        if ((item.label === 'Dinas' || item.label === 'Resmi') && officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) {
          url = officeInfoDb.instagramResmi;
        } else if (item.label === 'Pemuda' && officeInfoDb.instagramPemuda) {
          url = officeInfoDb.instagramPemuda;
        } else if (item.label === 'Wisata' && officeInfoDb.instagramTourism) {
          url = officeInfoDb.instagramTourism;
        } else if (item.label === 'YouTube' && officeInfoDb.youtube) {
          url = officeInfoDb.youtube;
        }
        return { ...item, url };
      });
      socialMediaList = socialMediaList.filter((item: any) => item.url !== '');
    }

    officeInfo = {
      address: officeInfoDb.address,
      phone: officeInfoDb.phone,
      email: officeInfoDb.email,
      operationalHours: officeInfoDb.operationalHours,
      socialMedia: {
        instagramResmi: (officeInfoDb.instagramResmi && !officeInfoDb.instagramResmi.startsWith('[')) ? officeInfoDb.instagramResmi : (socialMediaList.find(s => s.platform === 'instagram' && (s.label === 'Dinas' || s.label === 'Resmi'))?.url || ''),
        instagramTourism: officeInfoDb.instagramTourism,
        instagramPemuda: officeInfoDb.instagramPemuda,
        youtube: officeInfoDb.youtube
      },
      gmapsEmbedUrl: officeInfoDb.gmapsEmbedUrl,
      socialMediaList: socialMediaList
    };
  } else {
    const defaultOfficeInfo = dbData.officeInfo || {};
    officeInfo = {
      address: defaultOfficeInfo.address || '',
      phone: defaultOfficeInfo.phone || '',
      email: defaultOfficeInfo.email || '',
      operationalHours: defaultOfficeInfo.operationalHours || '',
      socialMedia: {
        instagramResmi: defaultOfficeInfo.socialMedia?.instagramResmi || '',
        instagramTourism: defaultOfficeInfo.socialMedia?.instagramTourism || '',
        instagramPemuda: defaultOfficeInfo.socialMedia?.instagramPemuda || '',
        youtube: defaultOfficeInfo.socialMedia?.youtube || ''
      },
      gmapsEmbedUrl: defaultOfficeInfo.gmapsEmbedUrl || '',
      socialMediaList: defaultOfficeInfo.socialMediaList || []
    };
  }

  return (
    <KontakPageClient
      initialOfficeInfo={officeInfo || undefined}
    />
  );
}
