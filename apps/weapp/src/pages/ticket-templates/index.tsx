import { Text, View } from '@tarojs/components';
import {
  FlightTicketTemplate,
  MovieTicketTemplate,
  ScenicTicketTemplate,
  TrainTicketTemplate
} from '../../components/TicketTemplates';
import './index.less';

const flightPreview = {
  passenger: 'LEMON',
  from: 'SHA',
  to: 'CTU',
  gate: '18',
  seat: '12A',
  boardingTime: '09:30',
  qrText: '一路有风，抵达有光。'
};

const moviePreview = {
  title: '奥本海默',
  subtitle: 'OPPENHEIMER',
  category: '电影票',
  rating: '5',
  releaseDate: '2023.08.30',
  duration: '180 MIN',
  hall: '03',
  seat: '8排12座',
  price: '45',
  date: '08.30',
  time: '19:20',
  quote: 'A film ticket memory.'
};

const trainPreview = {
  ticketNo: 'G1024',
  waitingRoom: 'B6',
  fromStation: '上海虹桥',
  fromPinyin: 'SHANGHAIHONGQIAO',
  trainNo: 'G1024',
  toStation: '杭州东',
  toPinyin: 'HANGZHOUDONG',
  departureTime: '2026年06月30日 10:28开',
  carriageSeat: '05车 12A号',
  price: '￥73.0元',
  seatClass: '二等座',
  note: '限乘当日当次车',
  serialNo: 'A023441',
  saleStation: '上海站售',
  qrText: '去哪里不重要，重要的是出发。'
};

const scenicPreview = {
  title: '乌菲兹美术馆之巅',
  location: 'FLORENCE',
  archiveNo: 'NO.0915',
  date: '2023.09.15',
  time: '14:20',
  ticketType: '展览',
  price: '88',
  scanTime: '2023.09.15 14:18',
  ticketNo: 'PG-20230915',
  qrText: '人间有趣，值得入场。'
};

export default function TicketTemplatesPage() {
  return (
    <View className='page template-page'>
      <View className='template-header'>
        <Text className='template-title'>票根模板</Text>
        <Text className='template-desc'>模板内容区域默认留空，后续 OCR 识别后填充。</Text>
      </View>

      <View className='template-section'>
        <Text className='template-section-title'>模板一 · 机票</Text>
        <View className='template-flight-rotated-preview'>
          <View className='template-flight-rotated-inner'>
            <FlightTicketTemplate data={flightPreview} />
          </View>
        </View>
      </View>

      <View className='template-section'>
        <Text className='template-section-title'>模板二 · 电影票</Text>
        <View className='template-movie-preview'>
          <View className='template-movie-preview-inner'>
            <MovieTicketTemplate data={moviePreview} />
          </View>
        </View>
      </View>

      <View className='template-section'>
        <Text className='template-section-title'>模板三 · 高铁票</Text>
        <View className='template-train-preview'>
          <View className='template-train-preview-inner'>
            <TrainTicketTemplate data={trainPreview} />
          </View>
        </View>
      </View>

      <View className='template-section'>
        <Text className='template-section-title'>模板四 · 景区门票</Text>
        <View className='template-scenic-preview'>
          <View className='template-scenic-preview-inner'>
            <ScenicTicketTemplate data={scenicPreview} />
          </View>
        </View>
      </View>
    </View>
  );
}
