import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import type { DailyQuote, Ticket } from '@piaogen/shared';
import { useMemo, useState } from 'react';
import { AppFooter } from '../../components/AppFooter';
import { IconifyIcon } from '../../components/IconifyIcon';
import { getLatestDailyQuote } from '../../services/daily-quotes';
import { getTickets } from '../../services/tickets';
import './index.less';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

interface CalendarCell {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
  tickets: Ticket[];
}

function pad(value: number) {
  return `${value}`.padStart(2, '0');
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseTicketDate(value: string) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function buildCalendarCells(monthDate: Date, tickets: Ticket[]): CalendarCell[] {
  const monthStart = getMonthStart(monthDate);
  const firstWeekday = monthStart.getDay();
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - firstWeekday);

  const ticketMap = tickets.reduce<Record<string, Ticket[]>>((result, ticket) => {
    const key = toDateKey(parseTicketDate(ticket.eventDate));
    result[key] = result[key] || [];
    result[key].push(ticket);
    return result;
  }, {});

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const key = toDateKey(date);

    return {
      date,
      key,
      day: date.getDate(),
      inMonth: date.getMonth() === monthStart.getMonth(),
      tickets: ticketMap[key] || []
    };
  });
}

export default function CalendarPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [monthDate, setMonthDate] = useState(() => getMonthStart(new Date()));

  useDidShow(() => {
    getTickets()
      .then(setTickets)
      .catch((error) => {
        Taro.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      });

    getLatestDailyQuote()
      .then(setDailyQuote)
      .catch(() => {
        setDailyQuote(null);
      });
  });

  const cells = useMemo(() => buildCalendarCells(monthDate, tickets), [monthDate, tickets]);

  const openDay = (cell: CalendarCell) => {
    if (cell.tickets.length === 0) {
      return;
    }

    Taro.navigateTo({
      url: `/pages/ticket-detail/index?id=${cell.tickets[0].id}`
    });
  };

  return (
    <View className='page calendar-page'>
      {dailyQuote ? (
        <View className='daily-quote'>
          <View className='daily-quote-spine' />
          <View className='daily-quote-ribbon' />
          <Text className='daily-quote-content'>{dailyQuote.content}</Text>
          <Text className='daily-quote-author'>- {dailyQuote.author}</Text>
        </View>
      ) : null}

      <View className='calendar-card'>
        <View className='calendar-head'>
          <Text className='month-title'>{monthDate.getFullYear()}年{monthDate.getMonth() + 1}月</Text>
          <View className='month-actions'>
            <View className='month-arrow' onClick={() => setMonthDate(addMonths(monthDate, -1))}>
              <IconifyIcon color='#eb3d35' icon='chevron-left-rounded' />
            </View>
            <View className='month-arrow' onClick={() => setMonthDate(addMonths(monthDate, 1))}>
              <IconifyIcon color='#eb3d35' icon='chevron-right-rounded' />
            </View>
          </View>
        </View>

        <View className='week-row'>
          {weekDays.map((day) => (
            <Text className='week-cell' key={day}>{day}</Text>
          ))}
        </View>

        <View className='day-grid'>
          {cells.map((cell) => (
            <View
              className={`day-cell ${cell.inMonth ? '' : 'day-cell-muted'} ${cell.tickets.length ? 'day-cell-marked' : ''}`}
              key={cell.key}
              onClick={() => openDay(cell)}
            >
              <Text>{cell.day}</Text>
              {cell.tickets.length ? <View className='day-dot' /> : null}
            </View>
          ))}
        </View>
      </View>

      <AppFooter active='calendar' />
    </View>
  );
}
