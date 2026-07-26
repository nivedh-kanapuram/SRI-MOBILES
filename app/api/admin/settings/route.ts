import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.appSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    if (!('maintenanceMode' in map)) map.maintenanceMode = 'false';
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({ maintenanceMode: 'false' });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body;
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }
    const setting = await prisma.appSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    return NextResponse.json({ [setting.key]: setting.value });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
