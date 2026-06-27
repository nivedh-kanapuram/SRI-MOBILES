import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Simple security check
  if (secret !== 'admin-update-2024') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Delete all reviews first (due to foreign key constraints)
    const deletedReviews = await prisma.review.deleteMany({});

    // Delete all bookings
    const deletedBookings = await prisma.booking.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'Database cleaned successfully',
      deleted: {
        reviews: deletedReviews.count,
        bookings: deletedBookings.count,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to clean database' },
      { status: 500 }
    );
  }
}
