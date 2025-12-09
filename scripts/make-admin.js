const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
  console.error('Please provide email: node scripts/make-admin.js user@example.com');
  process.exit(1);
}

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });
  console.log(`User ${user.email} is now ADMIN`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
