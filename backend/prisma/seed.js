const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Roles
  const superadminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: {
      name: 'SUPERADMIN',
      permissions: JSON.stringify(['all']),
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      permissions: JSON.stringify(['read:dashboard', 'manage:users', 'read:users']),
    },
  });

  const kasirRole = await prisma.role.upsert({
    where: { name: 'KASIR' },
    update: {},
    create: {
      name: 'KASIR',
      permissions: JSON.stringify(['read:dashboard', 'manage:transactions', 'read:transactions']),
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      permissions: JSON.stringify(['read:dashboard']),
    },
  });

  console.log('Roles seeded successfully.');

  // 2. Seed Default Superadmin User
  const adminEmail = 'admin@mail.com';
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        username: 'superadmin',
        email: adminEmail,
        password: hashedPassword,
        roleId: superadminRole.id,
        isActive: true,
      },
    });
    console.log('Default superadmin user created: admin@mail.com / password123');
  } else {
    console.log('Superadmin user already exists.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
