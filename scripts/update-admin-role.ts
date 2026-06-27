import { prisma } from '../lib/prisma';

async function updateAdminRole() {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'srimobiles.dsnr@gmail.com' },
    });

    if (!user) {
      console.error('User not found with email: srimobiles.dsnr@gmail.com');
      process.exit(1);
    }

    console.log('Found user:', {
      id: user.id,
      email: user.email,
      name: user.name,
      currentRole: user.role,
    });

    // Update the role to admin
    const updatedUser = await prisma.user.update({
      where: { email: 'srimobiles.dsnr@gmail.com' },
      data: { role: 'admin' },
    });

    console.log('✅ User role updated successfully!');
    console.log('Updated user:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      newRole: updatedUser.role,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateAdminRole();
