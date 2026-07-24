import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, deviceType, brand, model: deviceModel, problem, issueCategory, additionalNotes, serviceType, visitDate, visitTimeSlot, pickupAddress, pickupLandmark, pincode, pickupLatitude, pickupLongitude, pickupDate, pickupTimeSlot, customerPhoto } = body;

    if (!fullName || !phone || !deviceType || !brand || !deviceModel || !problem || !serviceType) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json({ error: 'Please enter a valid Indian mobile number.' }, { status: 400 });
    }

    // Duplicate booking protection: same phone + model + issue within 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicate = await prisma.booking.findFirst({
      where: {
        phone,
        model: deviceModel,
        issueCategory: issueCategory || undefined,
        createdAt: { gte: fiveMinAgo },
      },
    });
    if (duplicate) {
      return NextResponse.json({ error: 'A similar booking already exists.' }, { status: 409 });
    }

    const year = new Date().getFullYear();
    const count = await prisma.booking.count();
    const trackingId = `SM${year}-${String(count + 1).padStart(4, '0')}`;

    const booking = await prisma.booking.create({
      data: {
        fullName, phone, email, deviceType, brand, model: deviceModel, problem, issueCategory: issueCategory || null, trackingId,
        additionalNotes: additionalNotes || null,
        serviceType, customerPhoto: customerPhoto || null,
        ...(serviceType === 'self_visit' ? { visitDate, visitTimeSlot } : {}),
        ...(serviceType === 'pickup' ? { pickupAddress, pickupLandmark, pincode, pickupLatitude: pickupLatitude || null, pickupLongitude: pickupLongitude || null, pickupDate, pickupTimeSlot } : {}),
      },
    });

    const isPickup = serviceType === 'pickup';
    const waMessage = isPickup
      ? `Your pickup booking has been confirmed!%0A%0ATracking ID: ${trackingId}%0ADevice: ${brand} ${deviceModel}%0APickup Date: ${pickupDate}%0ATime Slot: ${pickupTimeSlot}%0A%0AOur team will arrive during your selected time slot.%0A%0A-Sri Mobiles`
      : `Your repair booking has been confirmed!%0A%0ATracking ID: ${trackingId}%0ADevice: ${brand} ${deviceModel}%0AVisit Date: ${visitDate}%0ATime: ${visitTimeSlot}%0A%0APlease visit Sri Mobiles on your selected date and time.%0A%0A-Sri Mobiles`;

    return NextResponse.json({ ...booking, waMessage }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
