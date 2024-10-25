import users from './data/users.json';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient();
const ADMIN_EMAIL: string = 'admin@gmail.com';

const seedUsers = async () => {
  console.log('--- Start seeding users data ---');

  await prisma.user.deleteMany();
  for (const user of users) {
    const salt = await genSalt(10);
    const hashPassword = await hash(user.password, salt);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashPassword,
      },
    });

    console.log('Created user', user.name);
  }

  console.log('Seeding users data finished');
};

const main = async () => {
  await seedUsers();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
