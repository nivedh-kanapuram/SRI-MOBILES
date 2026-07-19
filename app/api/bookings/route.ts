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
    const body = await req.json();
    const { fullName, phone, email, deviceType, brand, model: deviceModel, problem, serviceType, visitDate, visitTimeSlot, pickupAddress, pickupLandmark, pincode, pickupDate, pickupTimeSlot } = body;
    if (!fullName || !phone || !deviceType || !brand || !deviceModel || !problem || !serviceType) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }
    const userId = (session.user as { id: string }).id;

    const year = new Date().getFullYear();
    const count = await prisma.booking.count();
    const trackingId = `SM${year}-${String(count + 1).padStart(4, '0')}`;

    const booking = await prisma.booking.create({
      data: {
        userId, fullName, phone, email, deviceType, brand, model: deviceModel, problem, trackingId,
        serviceType,
        ...(serviceType === 'self_visit' ? { visitDate, visitTimeSlot } : {}),
        ...(serviceType === 'pickup' ? { pickupAddress, pickupLandmark, pincode, pickupDate, pickupTimeSlot } : {}),
      },
    });

    const isPickup = serviceType === 'pickup';
    const waMessage = isPickup
      ? `Your pickup booking has been confirmed!%0A%0ATracking ID: ${trackingId}%0ADevice: ${brand} ${deviceModel}%0APickup Date: ${pickupDate}%0ATime Slot: ${pickupTimeSlot}%0A%0AOur team will arrive during your selected time slot.%0A%0A-Sri Mobiles`
      : `Your repair booking has been confirmed!%0A%0ATracking ID: ${trackingId}%0ADevice: ${brand} ${deviceModel}%0AVisit Date: ${visitDate}%0ATime: ${visitTimeSlot}%0A%0APlease visit Sri Mobiles on your selected date and time.%0A%0A-Sri Mobiles`;

    return NextResponse.json({ ...booking, waMessage }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
