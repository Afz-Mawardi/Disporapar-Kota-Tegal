import { prisma } from '@/lib/prisma';

interface AuditLogDetails {
  user: string;
  ip: string;
  endpoint: string;
  action: string;
  status: 'Berhasil' | 'Gagal';
  details?: Record<string, any>;
}

export const logAudit = async (data: AuditLogDetails) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Validate minimal fields
    const sanitizedData = {
      waktu: timestamp,
      user: data.user || 'Unknown',
      ip: data.ip || 'Unknown IP',
      endpoint: data.endpoint || 'Unknown Endpoint',
      aksi: data.action,
      status: data.status,
      ...data.details
    };

    // Store as JSON in the existing db.Text column without altering schema
    await prisma.adminLog.create({
      data: {
        action: JSON.stringify(sanitizedData),
      }
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};
