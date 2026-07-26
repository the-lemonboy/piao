import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import type { Ticket, TicketCategory } from '@piaogen/shared';
import { useEffect, useState } from 'react';
import { IconifyIcon } from '../../components/IconifyIcon';
import {
  FlightBoardingPassTemplate,
  MovieTicketTemplate,
  ScenicTicketTemplate,
  TrainTicketTemplate
} from '../../components/TicketTemplates';
import { deleteTicket, getTicket } from '../../services/tickets';
import './index.less';

const categoryLabel: Record<TicketCategory, string> = {
  movie: '电影票',
  concert: '演唱会门票',
  travel: '车票',
  exhibition: '展览票',
  other: '门票'
};

const defaultTravelQrText = '一路有风，抵达有光。';
const defaultScenicQrText = '人间有趣，值得入场。';

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatTime(value: string) {
  const date = new Date(value);
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');

  return `${hour}:${minute}`;
}

function splitRoute(title: string) {
  const route = title.split(/\s*[→-]\s*/);

  if (route.length >= 2) {
    return {
      from: route[0],
      to: route[1]
    };
  }

  return {
    from: '出发地',
    to: title
  };
}

function resolveTravelTemplateKind(details: Record<string, string>, venue: string) {
  if (details.ticketKind === 'flight' || details.ticketKind === 'train') {
    return details.ticketKind;
  }

  return /^(G|D|C|K|Z|T)\d+/i.test(venue.trim()) ? 'train' : 'flight';
}

function renderTicketTemplate(ticket: Ticket) {
  const date = formatDate(ticket.eventDate);
  const time = formatTime(ticket.eventDate);
  const details = ticket.details || {};

  if (ticket.category === 'travel') {
    const route = splitRoute(ticket.title);
    const travelTemplateKind = resolveTravelTemplateKind(details, ticket.venue);

    if (travelTemplateKind === 'train') {
      return (
        <TrainTicketTemplate
          data={{
            ticketNo: ticket.id.slice(0, 8).toUpperCase(),
            waitingRoom: details.waitingRoom || '候车大厅',
            fromStation: details.fromStation || route.from,
            trainNo: details.trainNo || ticket.venue,
            toStation: details.toStation || route.to,
            departureTime: `${date} ${time}`,
            carriageSeat: details.carriageSeat || '待补充',
            price: details.price || '已收藏',
            seatClass: details.seatClass || '二等座',
            note: ticket.note,
            serialNo: ticket.id.slice(-8).toUpperCase(),
            saleStation: ticket.city ? `${ticket.city}站` : '票根车站',
            qrText: details.qrText || defaultTravelQrText
          }}
        />
      );
    }

    return (
      <FlightBoardingPassTemplate
        data={{
          passenger: details.passenger || 'PIAOGEN',
          from: details.from || route.from,
          to: details.to || route.to,
          gate: details.gate || 'A12',
          seat: details.seat || '18F',
          boardingTime: details.boardingTime || `${date} ${time}`,
          qrText: details.qrText || defaultTravelQrText
        }}
      />
    );
  }

  if (ticket.category === 'exhibition' || ticket.category === 'other') {
    return (
      <ScenicTicketTemplate
        data={{
          backgroundUrl: ticket.imageUrl,
          title: ticket.title,
          location: ticket.venue,
          archiveNo: details.archiveNo || ticket.city,
          date,
          time,
          ticketType: details.ticketType || categoryLabel[ticket.category],
          price: details.price || '已收藏',
          scanTime: details.scanTime || time,
          ticketNo: ticket.id.slice(0, 12).toUpperCase(),
          qrText: details.qrText || defaultScenicQrText
        }}
      />
    );
  }

  return (
    <MovieTicketTemplate
      data={{
        posterUrl: ticket.imageUrl,
        title: ticket.title,
        subtitle: details.performer || ticket.venue,
        category: categoryLabel[ticket.category],
        rating: details.rating,
        releaseDate: date,
        duration: details.duration,
        hall: details.hall || ticket.city || ticket.venue,
        seat: details.seat || '待补充',
        price: details.price || 'COLLECTED',
        date,
        time,
        quote: ticket.note
      }}
    />
  );
}

export default function TicketDetailPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleEdit = () => {
    if (!ticket) {
      return;
    }

    Taro.navigateTo({
      url: `/pages/add-ticket/index?id=${ticket.id}`
    });
  };

  const handleDelete = async () => {
    if (!ticket || deleting) {
      return;
    }

    const result = await Taro.showModal({
      title: '删除票根',
      content: '删除后不可恢复，确定要删除这张票根吗？',
      confirmColor: '#eb3d35'
    });

    if (!result.confirm) {
      return;
    }

    try {
      setDeleting(true);
      await deleteTicket(ticket.id);
      Taro.showToast({
        title: '已删除',
        icon: 'success'
      });
      Taro.navigateBack();
    } catch (error) {
      Taro.showToast({
        title: error instanceof Error ? error.message : '删除失败',
        icon: 'none'
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!ticket) {
    return <View className='page detail-page'>加载中...</View>;
  }

  return (
    <View className='page detail-page'>
      <View className='ticket-actions'>
        <View className='ticket-action' onClick={handleEdit}>
          <IconifyIcon color='#5f5c57' icon='edit-rounded' />
        </View>
        <View className={deleting ? 'ticket-action ticket-action-disabled' : 'ticket-action'} onClick={handleDelete}>
          <IconifyIcon color='#eb3d35' icon='delete-rounded' />
        </View>
      </View>

      <View className='template-stage'>{renderTicketTemplate(ticket)}</View>
    </View>
  );
}
