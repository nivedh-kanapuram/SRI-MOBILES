import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const statusFilter = url.searchParams.get('status') || '';
  const brandFilter = url.searchParams.get('brand') || '';
  const dateFrom = url.searchParams.get('dateFrom') || '';
  const dateTo = url.searchParams.get('dateTo') || '';

  const where: Record<string, unknown> = {};

  if (statusFilter) {
    where.status = statusFilter;
  }

  if (brandFilter) {
    where.brand = brandFilter;
  }

  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.gte = new Date(dateFrom);
    if (dateTo) createdAt.lte = new Date(dateTo + 'T23:59:59.999Z');
    where.createdAt = createdAt;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { user: true, review: true },
    orderBy: { createdAt: 'desc' },
  });

  if (search) {
    const q = search.toLowerCase();
    return NextResponse.json(
      bookings.filter((b) =>
        (b.trackingId && b.trackingId.toLowerCase().includes(q)) ||
        b.fullName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.model.toLowerCase().includes(q)
      )
    );
  }

  return NextResponse.json(bookings);
}
