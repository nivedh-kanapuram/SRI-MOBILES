import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { review: { select: { id: true, rating: true, comment: true, createdAt: true, approved: true } } },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { fullName, phone, email, deviceType, brand, model: deviceModel, problem } = await req.json();
    if (!fullName || !phone || !deviceType || !brand || !deviceModel || !problem) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }
    const userId = (session.user as { id: string }).id;

    const year = new Date().getFullYear();
    const count = await prisma.booking.count();
    const trackingId = `SM${year}-${String(count + 1).padStart(4, '0')}`;

    const booking = await prisma.booking.create({
      data: { userId, fullName, phone, email, deviceType, brand, model: deviceModel, problem, trackingId },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
