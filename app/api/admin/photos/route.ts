import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { bookingId, beforeImage, afterImage } = await req.json();
  if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });

  const data: Record<string, string | null> = {};
  if (beforeImage !== undefined) data.beforeImage = beforeImage;
  if (afterImage !== undefined) data.afterImage = afterImage;

  const booking = await prisma.booking.update({ where: { id: bookingId }, data });
  return NextResponse.json(booking);
}
