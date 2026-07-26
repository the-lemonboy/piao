import { Image, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import type { Ticket } from '@piaogen/shared';
import { useEffect, useMemo, useState } from 'react';
import { AppFooter } from '../../components/AppFooter';
import { getTickets } from '../../services/tickets';
import './index.less';

type HomeCategory = 'movie' | 'train' | 'scenic';

const categoryOrder: HomeCategory[] = ['movie', 'train', 'scenic'];

const categoryLabel: Record<HomeCategory, string> = {
  movie: '电影票',
  train: '车票',
  scenic: '门票'
};

function formatDate(value: string) {
  const date = new Date(value);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
}

function buildColumns(items: Ticket[]) {
  return items.reduce<[Ticket[], Ticket[]]>(
    (result, ticket, index) => {
      result[index % 2].push(ticket);
      return result;
    },
    [[], []]
  );
}

function getTicketSearchText(ticket: Ticket) {
  return [ticket.title, ticket.venue, ticket.city, ticket.note].filter(Boolean).join('\n');
}

function resolveTrainRoute(ticket: Ticket) {
  const details = ticket.details || {};
  const from = details.fromStation || details.from;
  const to = details.toStation || details.to;

  if (from && to) {
    return `${from} → ${to}`;
  }

  return ticket.title;
}

function resolveHomeCategory(ticket: Ticket): HomeCategory | null {
  const text = getTicketSearchText(ticket);

  if (ticket.category === 'movie' || /电影|影院|影城|cinema|movie|film/i.test(text)) {
    return 'movie';
  }

  if (ticket.category === 'exhibition' || /景区|景点|门票|入园|admit one|scenic/i.test(text)) {
    return 'scenic';
  }

  if (ticket.category === 'travel') {
    return 'train';
  }

  return null;
}

export default function IndexPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<HomeCategory | null>(null);

  const categorySections = useMemo(() => {
    const categorizedTickets = tickets
      .map((ticket) => ({
        ticket,
        category: resolveHomeCategory(ticket)
      }))
      .filter((item): item is { ticket: Ticket; category: HomeCategory } => Boolean(item.category));

    return categoryOrder.map((category) => {
      const items = categorizedTickets
        .filter((item) => item.category === category)
        .map((item) => item.ticket);

      return {
        category,
        items,
        columns: buildColumns(items)
      };
    });
  }, [tickets]);
  const visibleSections = useMemo(() => {
    return activeCategory
      ? categorySections.filter((section) => section.category === activeCategory)
      : categorySections;
  }, [activeCategory, categorySections]);

  useEffect(() => {
    if (!activeCategory || !categorySections.some((section) => section.category === activeCategory)) {
      setActiveCategory(categorySections[0].category);
    }
  }, [activeCategory, categorySections]);

  useDidShow(() => {
    setLoading(true);
    getTickets()
      .then(setTickets)
      .catch((error) => {
        Taro.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      })
      .finally(() => setLoading(false));
  });

  const openDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/ticket-detail/index?id=${id}`
    });
  };

  const renderCover = (ticket: Ticket, category: HomeCategory) => {
    if (category === 'train') {
      return (
        <View className='memory-image memory-train-cover'>
          <View className='train-cover-rail train-cover-rail-top' />
          <View className='train-cover-rail train-cover-rail-bottom' />
          <View className='train-cover-badge'>
            <Text>车票</Text>
          </View>
          <Text className='train-cover-route'>{resolveTrainRoute(ticket)}</Text>
          <Text className='train-cover-meta'>{ticket.venue || ticket.city || 'TRAVEL TICKET'}</Text>
          <View className='train-cover-line'>
            <View className='train-cover-node' />
            <View className='train-cover-track' />
            <View className='train-cover-node' />
          </View>
        </View>
      );
    }

    if (ticket.imageUrl) {
      return <Image className='memory-image' mode='aspectFill' src={ticket.imageUrl} />;
    }

    return (
      <View className='memory-image memory-image-empty'>
        <Text>{categoryLabel[category]}</Text>
      </View>
    );
  };

  return (
    <View className='page home-page'>
      {categorySections.length > 0 ? (
        <View className='filter-bar'>
          {categorySections.map((section) => (
            <View
              className={`filter-chip ${section.category === activeCategory ? 'filter-chip-active' : ''}`}
              key={section.category}
              onClick={() => setActiveCategory(section.category)}
            >
              <Text>{categoryLabel[section.category]}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {loading ? <View className='empty home-empty'>加载中...</View> : null}

      {!loading && tickets.length === 0 ? <View className='empty home-empty'>还没有票根</View> : null}

      {!loading && tickets.length > 0 && visibleSections.every((section) => section.items.length === 0) ? (
        <View className='empty home-empty'>还没有{activeCategory ? categoryLabel[activeCategory] : '票根'}</View>
      ) : null}

      <View className='category-sections'>
        {visibleSections.filter((section) => section.items.length > 0).map((section) => (
          <View className='category-section' key={section.category}>
            <View className='category-head'>
              <Text className='category-title'>{categoryLabel[section.category]}</Text>
              <Text className='category-count'>{section.items.length} 张</Text>
            </View>

            <View className='masonry'>
              {section.columns.map((column, columnIndex) => (
                <View className='masonry-column' key={`${section.category}-${columnIndex}`}>
                  {column.map((ticket) => (
                    <View className='memory-card' key={ticket.id} onClick={() => openDetail(ticket.id)}>
                      {renderCover(ticket, section.category)}
                      <View className='memory-body'>
                        <View className='ticket-perforation' />
                        <Text className='memory-date'>{formatDate(ticket.eventDate)}</Text>
                        <Text className='memory-title'>{ticket.title}</Text>
                        <Text className={`memory-tag memory-tag-${section.category}`}>
                          {categoryLabel[section.category]}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <AppFooter active='home' />
    </View>
  );
}
