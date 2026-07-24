import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { trackingId, rating } = await req.json();

    if (!trackingId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { trackingId },
      select: { id: true, status: true, customerRating: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'completed') {
      return NextResponse.json({ error: 'Rating is only available after repair completion' }, { status: 400 });
    }

    if (booking.customerRating !== null) {
      return NextResponse.json({ error: 'You have already submitted your rating' }, { status: 400 });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { customerRating: rating },
    });

    return NextResponse.json({ success: true, rating });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
