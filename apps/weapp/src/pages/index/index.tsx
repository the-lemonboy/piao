import { Image, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Ticket, TicketCategory } from '@piaogen/shared';
import { useMemo, useState } from 'react';
import { AppFooter } from '../../components/AppFooter';
import { getTickets } from '../../services/tickets';
import './index.less';

const filters: Array<{ label: string; value: TicketCategory | 'all' }> = [
  { label: '全部', value: 'all' },
  { label: '电影', value: 'movie' },
  { label: '演唱会', value: 'concert' },
  { label: '展览', value: 'exhibition' },
  { label: '戏剧', value: 'other' }
];

const categoryLabel: Record<TicketCategory, string> = {
  movie: '电影',
  concert: '演唱会',
  travel: '旅行',
  exhibition: '展览',
  sports: '运动',
  other: '戏剧'
};

function formatDate(value: string) {
  const date = new Date(value);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
}

export default function IndexPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TicketCategory | 'all'>('all');

  const visibleTickets = useMemo(() => {
    if (activeFilter === 'all') {
      return tickets;
    }

    return tickets.filter((ticket) => ticket.category === activeFilter);
  }, [activeFilter, tickets]);

  const columns = useMemo(() => {
    return visibleTickets.reduce<[Ticket[], Ticket[]]>(
      (result, ticket, index) => {
        result[index % 2].push(ticket);
        return result;
      },
      [[], []]
    );
  }, [visibleTickets]);

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

  return (
    <View className='page home-page'>
      <View className='filter-bar'>
        {filters.map((filter) => (
          <View
            className={`filter-chip ${filter.value === activeFilter ? 'filter-chip-active' : ''}`}
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
          >
            <Text>{filter.label}</Text>
          </View>
        ))}
      </View>

      {loading ? <View className='empty'>加载中...</View> : null}

      {!loading && visibleTickets.length === 0 ? <View className='empty'>还没有票根</View> : null}

      <View className='masonry'>
        {columns.map((column, columnIndex) => (
          <View className='masonry-column' key={`column-${columnIndex}`}>
            {column.map((ticket, index) => (
              <View
                className={`memory-card ${index % 2 === 0 ? 'memory-card-tall' : 'memory-card-short'}`}
                key={ticket.id}
                onClick={() => openDetail(ticket.id)}
              >
                {ticket.imageUrl ? (
                  <Image className='memory-image' mode='aspectFill' src={ticket.imageUrl} />
                ) : (
                  <View className='memory-image memory-image-empty' />
                )}
                <View className='memory-body'>
                  <View className='ticket-perforation' />
                  <Text className='memory-date'>{formatDate(ticket.eventDate)}</Text>
                  <Text className='memory-title'>{ticket.title}</Text>
                  <Text className={`memory-tag memory-tag-${ticket.category}`}>
                    {categoryLabel[ticket.category]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      <AppFooter active='home' />
    </View>
  );
}
