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
  const pending = await prisma.booking.count({ where: { status: 'pending' } });
  const inProgress = await prisma.booking.count({ where: { status: 'in_progress' } });
  const completed = await prisma.booking.count({ where: { status: 'completed' } });
  const cancelled = await prisma.booking.count({ where: { status: 'cancelled' } });
  const totalUsers = await prisma.user.count();
  return NextResponse.json({ total, pending, inProgress, completed, cancelled, totalUsers });
}
