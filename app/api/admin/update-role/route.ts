import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const secret = request.nextUrl.searchParams.get('secret');

  // Simple security check
  if (secret !== 'admin-update-2024') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: `User not found with email: ${email}` },
        { status: 404 }
      );
    }

    // Update the role to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    return NextResponse.json({
      success: true,
      message: 'User role updated to admin',
      before: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      after: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
