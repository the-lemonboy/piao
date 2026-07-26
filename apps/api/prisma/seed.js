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
  },
  {
    id: 'seed-5',
    title: '灌篮高手',
    venue: '上海影城 1 号厅',
    city: '上海',
    eventDate: new Date('2023-04-22T11:20:00.000Z'),
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
    note: '和高中同学一起看的午场。',
    createdAt: new Date('2023-04-22T09:30:00.000Z'),
    updatedAt: new Date('2023-04-22T09:30:00.000Z')
  },
  {
    id: 'seed-6',
    title: 'Taylor Swift: The Eras Tour',
    venue: 'IMAX 激光厅',
    city: '深圳',
    eventDate: new Date('2023-12-31T16:00:00.000Z'),
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    note: '跨年前的演唱会电影。',
    createdAt: new Date('2023-12-31T12:20:00.000Z'),
    updatedAt: new Date('2023-12-31T12:20:00.000Z')
  },
  {
    id: 'seed-7',
    title: '五月天 好好好想见到你',
    venue: '国家体育场',
    city: '北京',
    eventDate: new Date('2024-05-18T11:30:00.000Z'),
    category: 'concert',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    note: '全场大合唱的一晚。',
    createdAt: new Date('2024-05-18T08:00:00.000Z'),
    updatedAt: new Date('2024-05-18T08:00:00.000Z')
  },
  {
    id: 'seed-8',
    title: '苏州博物馆本馆预约',
    venue: '苏州博物馆',
    city: '苏州',
    eventDate: new Date('2024-03-16T02:30:00.000Z'),
    category: 'exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08',
    note: '白墙灰瓦，雨后很安静。',
    createdAt: new Date('2024-03-16T01:00:00.000Z'),
    updatedAt: new Date('2024-03-16T01:00:00.000Z')
  },
  {
    id: 'seed-9',
    title: 'teamLab 无界美术馆',
    venue: '麻布台之丘',
    city: '东京',
    eventDate: new Date('2024-06-09T05:00:00.000Z'),
    category: 'exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
    note: '光影像水一样漫过墙面。',
    createdAt: new Date('2024-06-09T03:30:00.000Z'),
    updatedAt: new Date('2024-06-09T03:30:00.000Z')
  },
  {
    id: 'seed-10',
    title: '上海虹桥 → 厦门北',
    venue: 'G1655 次列车',
    city: '厦门',
    eventDate: new Date('2024-08-23T00:18:00.000Z'),
    category: 'travel',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3',
    note: '靠窗座位，海风在下午抵达。',
    createdAt: new Date('2024-08-22T12:00:00.000Z'),
    updatedAt: new Date('2024-08-22T12:00:00.000Z')
  },
  {
    id: 'seed-11',
    title: '中超联赛 上海海港 vs 北京国安',
    venue: '浦东足球场',
    city: '上海',
    eventDate: new Date('2024-07-12T11:35:00.000Z'),
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d',
    note: '第一次坐到主队看台。',
    createdAt: new Date('2024-07-12T09:20:00.000Z'),
    updatedAt: new Date('2024-07-12T09:20:00.000Z')
  },
  {
    id: 'seed-12',
    title: '上海迪士尼乐园一日票',
    venue: '上海迪士尼度假区',
    city: '上海',
    eventDate: new Date('2024-10-04T01:00:00.000Z'),
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1590144662036-33bf0ebd2c7f',
    note: '烟花结束后才舍得离开。',
    createdAt: new Date('2024-10-03T14:00:00.000Z'),
    updatedAt: new Date('2024-10-03T14:00:00.000Z')
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
