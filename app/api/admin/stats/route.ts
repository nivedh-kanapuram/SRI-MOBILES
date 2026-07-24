import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const total = await prisma.booking.count();
  const pending = await prisma.booking.count({ where: { status: { in: ['booking_confirmed', 'device_received'] } } });
  const inProgress = await prisma.booking.count({ where: { status: { in: ['diagnosis_complete', 'repair_in_progress', 'waiting_for_parts'] } } });
  const completed = await prisma.booking.count({ where: { status: 'completed' } });
  const cancelled = await prisma.booking.count({ where: { status: 'cancelled' } });
  const totalUsers = await prisma.user.count();

  const ratingStats = await prisma.booking.aggregate({
    _avg: { customerRating: true },
    _count: { customerRating: true },
    where: { customerRating: { not: null } },
  });
  const avgRating = ratingStats._avg.customerRating ?? 0;
  const totalReviews = ratingStats._count.customerRating;

  return NextResponse.json({ total, pending, inProgress, completed, cancelled, totalUsers, avgRating: Math.round(avgRating * 10) / 10, totalReviews });
}
