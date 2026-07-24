import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bookingId = formData.get('bookingId') as string;

    if (!file || !bookingId) {
      return NextResponse.json({ error: 'Missing file or bookingId' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const fileName = `invoice-${bookingId}-${Date.now()}.pdf`;
    const dir = path.join(process.cwd(), 'public', 'uploads', 'invoices');
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, new Uint8Array(bytes));

    const url = `/uploads/invoices/${fileName}`;

    const { prisma } = await import('@/lib/prisma');
    await prisma.booking.update({
      where: { id: bookingId },
      data: { invoiceUrl: url },
    });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
