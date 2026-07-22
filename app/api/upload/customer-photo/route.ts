import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
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
  const dir = path.join(process.cwd(), 'public', 'uploads', 'customer');

  await mkdir(dir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const filePath = path.join(dir, fileName);
  await writeFile(filePath, new Uint8Array(bytes));

  const url = `/uploads/customer/${fileName}`;

  return NextResponse.json({ url });
}
