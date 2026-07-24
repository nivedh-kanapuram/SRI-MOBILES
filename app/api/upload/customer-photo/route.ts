import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/upload-file';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WEBP are allowed' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${ext}`;

    const { url } = await uploadFile(fileName, file, 'customer');
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[customer-photo] Upload failed:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to upload image: ${msg}` }, { status: 500 });
  }
}