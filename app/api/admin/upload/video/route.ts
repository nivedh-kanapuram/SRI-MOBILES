import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/upload-file';

const MAX_SIZE = 100 * 1024 * 1024;
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bookingId = formData.get('bookingId') as string | null;

    if (!file || !bookingId) {
      return NextResponse.json({ error: 'Missing file or bookingId' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only MP4, MOV, and WEBM files are allowed' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Video must be under 100 MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'mp4';
    const fileName = `repair-video-${bookingId}-${Date.now()}.${ext}`;

    const { url } = await uploadFile(fileName, file, `repairs/${bookingId}/video`);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[video-upload] Upload failed:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to upload video: ${msg}` }, { status: 500 });
  }
}