import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: 'maintenanceMode' } });
    return NextResponse.json({ maintenanceMode: setting?.value === 'true' });
  } catch {
    return NextResponse.json({ maintenanceMode: false });
  }
}
