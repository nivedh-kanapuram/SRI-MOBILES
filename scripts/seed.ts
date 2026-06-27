import { PrismaClient } from '../lib/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await hash('Sri@232656', 12);
  await prisma.user.upsert({
    where: { email: 'srimobiles.dsnr@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'srimobiles.dsnr@gmail.com',
      password: adminPassword,
      role: 'admin',
      phone: '9948299426',
    },
  });
  const customerPassword = await hash('customer123', 12);
  await prisma.user.upsert({
    where: { email: 'demo@srimobiles.in' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'demo@srimobiles.in',
      password: customerPassword,
      role: 'customer',
      phone: '9999999999',
    },
  });
  console.log('Seed complete: srimobiles.dsnr@gmail.com / Sri@232656, demo@srimobiles.in / customer123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
