const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const tickets = [
  {
    id: 'seed-1',
    title: '奥本海默',
    venue: '和平影城 3 号厅',
    city: '上海',
    eventDate: new Date('2023-08-30T20:30:00.000Z'),
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    note: '午夜场电影票。',
    createdAt: new Date('2023-08-30T12:00:00.000Z'),
    updatedAt: new Date('2023-08-30T12:00:00.000Z')
  },
  {
    id: 'seed-2',
    title: '乌菲兹美术馆之巅',
    venue: '乌菲兹美术馆',
    city: '佛罗伦萨',
    eventDate: new Date('2023-09-15T11:00:00.000Z'),
    category: 'exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1545987796-200677ee1011',
    note: '展览纪念票。',
    createdAt: new Date('2023-09-15T10:00:00.000Z'),
    updatedAt: new Date('2023-09-15T10:00:00.000Z')
  },
  {
    id: 'seed-3',
    title: '周杰伦嘉年华巡回',
    venue: '城市体育场',
    city: '杭州',
    eventDate: new Date('2023-07-12T12:00:00.000Z'),
    category: 'concert',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    note: '第一次站到前排。',
    createdAt: new Date('2023-07-12T10:00:00.000Z'),
    updatedAt: new Date('2023-07-12T10:00:00.000Z')
  },
  {
    id: 'seed-4',
    title: '芭比：粉色乌托邦',
    venue: '百老汇影城',
    city: '北京',
    eventDate: new Date('2023-10-01T19:30:00.000Z'),
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
    note: '粉色主题电影夜。',
    createdAt: new Date('2023-10-01T10:00:00.000Z'),
    updatedAt: new Date('2023-10-01T10:00:00.000Z')
  }
];

async function main() {
  for (const ticket of tickets) {
    await prisma.ticket.upsert({
      where: { id: ticket.id },
      update: ticket,
      create: ticket
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
