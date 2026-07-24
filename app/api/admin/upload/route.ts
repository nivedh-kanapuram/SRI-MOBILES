import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/upload-file';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const bookingId = formData.get('bookingId') as string | null;
  const type = formData.get('type') as string | null;

  if (!file || !bookingId || !type) {
    return NextResponse.json({ error: 'Missing file, bookingId, or type' }, { status: 400 });
  }

  if (!['before', 'after'].includes(type)) {
    return NextResponse.json({ error: 'type must be "before" or "after"' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, and WEBP are allowed' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${type}.${ext}`;

  try {
    const { url } = await uploadFile(fileName, file, `repairs/${bookingId}`);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}