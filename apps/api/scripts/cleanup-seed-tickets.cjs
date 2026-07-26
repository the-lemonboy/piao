const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.ticket.deleteMany({
    where: {
      id: {
        startsWith: 'seed-'
      }
    }
  });

  console.log(`Removed ${result.count} seeded ticket(s).`);
}

main()
  .catch((error) => {
    console.error('Failed to remove seeded tickets:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
