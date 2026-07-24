import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { bookingId, phone } = await req.json();
    if (!bookingId && !phone) {
      return NextResponse.json({ error: 'Provide a Booking ID or Phone Number' }, { status: 400 });
    }

    let booking;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { trackingId: bookingId },
        select: {
          trackingId: true, fullName: true, phone: true, email: true,
          deviceType: true, brand: true, model: true, problem: true, issueCategory: true,
          status: true, adminNotes: true, serviceType: true,
          beforeImage: true, afterImage: true,
          visitDate: true, visitTimeSlot: true,
          pickupAddress: true, pickupLandmark: true, pincode: true, invoiceUrl: true,
          pickupDate: true, pickupTimeSlot: true,
          createdAt: true, updatedAt: true,
        },
      });
    } else {
      booking = await prisma.booking.findFirst({
        where: { phone },
        orderBy: { createdAt: 'desc' },
        select: {
          trackingId: true, fullName: true, phone: true, email: true,
          deviceType: true, brand: true, model: true, problem: true, issueCategory: true,
          status: true, adminNotes: true, serviceType: true,
          beforeImage: true, afterImage: true,
          visitDate: true, visitTimeSlot: true,
          pickupAddress: true, pickupLandmark: true, pincode: true, invoiceUrl: true,
          pickupDate: true, pickupTimeSlot: true,
          createdAt: true, updatedAt: true,
        },
      });
    }

    if (!booking) {
      return NextResponse.json({
        error: 'Booking not found. If you believe this is a mistake, please contact Sri Mobiles.',
        phone: '9948299426',
      }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
