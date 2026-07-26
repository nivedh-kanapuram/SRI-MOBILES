import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  const { status, adminNotes, outstandingAmount, paymentStatus } = await req.json();

  if (status) {
    const existing = await prisma.booking.findUnique({
      where: { id },
      select: { customerRating: true },
    });
    if (existing?.customerRating !== null) {
      return NextResponse.json({ error: 'Status locked: customer has already submitted a review' }, { status: 403 });
    }
  }

  const data: Record<string, string | number | null> = {};
  if (status) data.status = status;
  if (adminNotes !== undefined) data.adminNotes = adminNotes;
  if (outstandingAmount !== undefined) data.outstandingAmount = outstandingAmount;
  if (paymentStatus !== undefined) {
    data.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      data.status = 'completed';
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data,
  });

  return NextResponse.json(booking);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id }, select: { trackingId: true, phone: true } });
  if (booking?.trackingId) {
    await prisma.deletedBooking.create({ data: { trackingId: booking.trackingId, phone: booking.phone } });
  }
  await prisma.review.deleteMany({ where: { bookingId: id } });
  await prisma.booking.delete({ where: { id } });

  return NextResponse.json({ success: true });
}