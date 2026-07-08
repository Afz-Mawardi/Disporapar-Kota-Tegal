export const uploadFileBase64 = async (base64String: string, fileName: string, menu: string): Promise<string> => {
  if (!base64String.startsWith('data:')) return base64String;
  
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileBase64: base64String, fileName, menu })
    });
    const result = await res.json();
    if (result.success) return result.url;
    throw new Error(result.error || 'Upload failed');
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const deleteFileByUrl = async (fileUrl: string): Promise<void> => {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  
  try {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl })
    });
    const result = await res.json();
    if (!result.success) {
      console.warn('Failed to delete old file:', result.error);
    }
  } catch (error) {
    console.error('File delete error:', error);
  }
};
