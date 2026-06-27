import { PrismaClient } from '../lib/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  }),
});

async function main() {
  const adminPassword = await hash('Sri@232656', 12);
  await prisma.user.upsert({
    where: { email: 'srimobiles.dsnr@gmail.com' },
    update: { role: 'admin' },
    create: {
      name: 'Admin',
      email: 'srimobiles.dsnr@gmail.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91-6303139018',
    },
  });
  console.log('✅ Admin user created/updated');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
