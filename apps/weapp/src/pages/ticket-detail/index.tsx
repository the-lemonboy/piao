import { Image, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Ticket } from '@piaogen/shared';
import { useEffect, useState } from 'react';
import { getTicket } from '../../services/tickets';
import './index.less';

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export default function TicketDetailPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const id = router.params.id;

    if (!id) {
      return;
    }

    getTicket(id)
      .then(setTicket)
      .catch((error) => {
        Taro.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      });
  }, [router.params.id]);

  if (!ticket) {
    return <View className='page detail-page'>加载中...</View>;
  }

  return (
    <View className='page detail-page'>
      {ticket.imageUrl ? <Image className='cover' mode='aspectFill' src={ticket.imageUrl} /> : null}
      <View className='detail-panel'>
        <Text className='title'>{ticket.title}</Text>
        <Text className='venue'>{ticket.venue}</Text>
        <View className='info-row'>
          <Text className='label'>日期</Text>
          <Text>{formatDate(ticket.eventDate)}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>类型</Text>
          <Text>{ticket.category}</Text>
        </View>
        {ticket.note ? <Text className='note'>{ticket.note}</Text> : null}
      </View>
    </View>
  );
}
