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
  const { status, adminNotes, costEstimateAmount, customerRating } = await req.json();

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(adminNotes !== undefined && { adminNotes }),
      ...(costEstimateAmount !== undefined && { costEstimateAmount }),
      ...(customerRating !== undefined && { customerRating }),
    },
  });

  return NextResponse.json(booking);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;

  await prisma.review.deleteMany({ where: { bookingId: id } });
  await prisma.booking.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
