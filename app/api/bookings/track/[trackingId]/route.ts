import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: Promise<{ trackingId: string }> }) {
  const { trackingId } = await params;
  if (!trackingId) return NextResponse.json({ error: 'Missing tracking ID' }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { trackingId },
    select: {
      trackingId: true, fullName: true, phone: true, email: true,
      deviceType: true, brand: true, model: true, problem: true,
      status: true, adminNotes: true, beforeImage: true, afterImage: true,
      createdAt: true, updatedAt: true,
    },
  });

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  return NextResponse.json(booking);
}
