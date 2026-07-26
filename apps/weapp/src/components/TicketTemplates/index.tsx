import { Image, Text, View } from '@tarojs/components';
import QRCode from 'qrcode';
import { useMemo } from 'react';
import './index.less';

export interface FlightTicketTemplateData {
  passenger?: string;
  from?: string;
  to?: string;
  gate?: string;
  seat?: string;
  boardingTime?: string;
  qrText?: string;
}

interface FlightTicketTemplateProps {
  data?: FlightTicketTemplateData;
  scale?: 'normal' | 'compact';
}

export interface MovieTicketTemplateData {
  posterUrl?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  rating?: string;
  releaseDate?: string;
  duration?: string;
  hall?: string;
  seat?: string;
  price?: string;
  date?: string;
  time?: string;
  quote?: string;
}

interface MovieTicketTemplateProps {
  data?: MovieTicketTemplateData;
}

export interface TrainTicketTemplateData {
  ticketNo?: string;
  waitingRoom?: string;
  fromStation?: string;
  fromPinyin?: string;
  trainNo?: string;
  toStation?: string;
  toPinyin?: string;
  departureTime?: string;
  carriageSeat?: string;
  price?: string;
  seatClass?: string;
  note?: string;
  serialNo?: string;
  saleStation?: string;
  qrText?: string;
}

interface TrainTicketTemplateProps {
  data?: TrainTicketTemplateData;
}

export interface ScenicTicketTemplateData {
  backgroundUrl?: string;
  title?: string;
  location?: string;
  archiveNo?: string;
  date?: string;
  time?: string;
  ticketType?: string;
  price?: string;
  scanTime?: string;
  ticketNo?: string;
  qrText?: string;
}

interface ScenicTicketTemplateProps {
  data?: ScenicTicketTemplateData;
}

const DEFAULT_TRAVEL_QR_TEXT = '一路有风，抵达有光。';
const DEFAULT_SCENIC_QR_TEXT = '人间有趣，值得入场。';
const PLANE_ICON_PATH =
  'M20.56 3.91c.59.59.59 1.54 0 2.12l-3.89 3.89l2.12 9.19l-1.41 1.42l-3.88-7.43L9.6 17l.36 2.47l-1.07 1.06l-1.76-3.18l-3.19-1.77L5 14.5l2.5.37L11.37 11L3.94 7.09l1.42-1.41l9.19 2.12l3.89-3.89c.56-.58 1.56-.58 2.12 0';
const TRAIN_ICON_PATHS = [
  'M21 13c0-3.87-3.37-7-10-7H3m0 9h16a2 2 0 0 0 2-2',
  'M3 6v5h17.5M3 11v4m5-4V6m5 5V6.5M3 19h18'
];

function TicketQrCode({ text, className = '' }: { text?: string; className?: string }) {
  const modules = useMemo(() => {
    const qr = QRCode.create(text || DEFAULT_TRAVEL_QR_TEXT, {
      errorCorrectionLevel: 'M'
    });

    return {
      size: qr.modules.size,
      data: Array.from(qr.modules.data, Boolean)
    };
  }, [text]);

  const cellSize = `${100 / modules.size}%`;

  return (
    <View className={`ticket-qr ${className}`}>
      {modules.data.map((filled, index) => (
        <View
          className={filled ? 'ticket-qr-cell ticket-qr-cell-dark' : 'ticket-qr-cell'}
          key={`qr-cell-${index}`}
          style={{ width: cellSize, height: cellSize }}
        />
      ))}
    </View>
  );
}

function FieldValue({ value, className = '' }: { value?: string; className?: string }) {
  return <Text className={`flight-value ${value ? '' : 'flight-value-empty'} ${className}`}>{value || ' '}</Text>;
}

function PlaneIcon({ className = '', color = '#0b0b0b' }: { className?: string; color?: string }) {
  const source = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="${color}" d="${PLANE_ICON_PATH}"/></svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [color]);

  return <Image className={`plane-icon ${className}`} mode='aspectFit' src={source} />;
}

function TrainIcon({ className = '', color = '#58bee0' }: { className?: string; color?: string }) {
  const source = useMemo(() => {
    const paths = TRAIN_ICON_PATHS.map((path) => `<path d="${path}"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><g fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">${paths}</g></svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [color]);

  return <Image className={`train-icon ${className}`} mode='aspectFit' src={source} />;
}

export function FlightTicketTemplate({ data, scale = 'normal' }: FlightTicketTemplateProps) {
  return (
    <View className={`flight-ticket-template flight-ticket-template-${scale}`}>
      <View className='flight-ticket-main'>
        <View className='flight-ticket-header'>
          <View>
            <Text className='flight-ticket-logo'>TRAVEL</Text>
            <View className='flight-logo-lines'>
              <View className='flight-logo-line' />
              <View className='flight-logo-line' />
              <View className='flight-logo-line-long' />
            </View>
          </View>
        </View>

        <View className='flight-main-body'>
          <View className='plane-mark'>
            <PlaneIcon />
          </View>
          <View className='flight-field flight-passenger'>
            <Text className='flight-label'>Passenger.</Text>
            <FieldValue value={data?.passenger} className='flight-passenger-value' />
            <View className='flight-soft-line flight-soft-line-name' />
          </View>

          <View className='route-row'>
            <View className='flight-field route-field'>
              <Text className='flight-label'>From:</Text>
              <FieldValue value={data?.from} className='route-value' />
            </View>
            <View className='flight-field route-field route-field-right'>
              <Text className='flight-label'>To:</Text>
              <FieldValue value={data?.to} className='route-value' />
            </View>
          </View>

          <View className='flight-meta-row'>
            <View className='flight-field flight-meta-field'>
              <Text className='flight-label'>Gate:</Text>
              <FieldValue value={data?.gate} />
              <View className='flight-soft-square' />
            </View>
            <View className='flight-field flight-meta-field'>
              <Text className='flight-label'>Seat:</Text>
              <FieldValue value={data?.seat} />
              <View className='flight-soft-square' />
            </View>
            <View className='flight-field flight-meta-field'>
              <Text className='flight-label'>Boarding time:</Text>
              <FieldValue value={data?.boardingTime} />
              <View className='flight-soft-square' />
            </View>
          </View>
        </View>
      </View>

      <View className='flight-barcode-column'>
        <TicketQrCode className='flight-qr-code' text={data?.qrText} />
      </View>

      <View className='flight-perforation'>
        {Array.from({ length: 11 }).map((_, index) => (
          <View className='flight-perforation-hole' key={`hole-${index}`} />
        ))}
      </View>

      <View className='flight-ticket-stub'>
        <View className='flight-stub-header'>
          <Text>PASSENGER TICKET</Text>
        </View>
        <View className='flight-stub-body'>
          <View className='stub-meta-row'>
            <View className='flight-field stub-meta-field'>
              <Text className='flight-label'>Gate:</Text>
              <FieldValue value={data?.gate} />
            </View>
            <View className='flight-field stub-meta-field'>
              <Text className='flight-label'>Seat:</Text>
              <FieldValue value={data?.seat} />
            </View>
            <View className='flight-field stub-meta-field'>
              <Text className='flight-label'>Boarding time:</Text>
              <FieldValue value={data?.boardingTime} />
            </View>
          </View>
          <View className='flight-soft-line' />
          <View className='stub-route-row'>
            <View className='stub-route-labels'>
              <Text>From:</Text>
              <Text>To:</Text>
            </View>
            <View className='stub-route-values'>
              <FieldValue value={data?.from} />
              <FieldValue value={data?.to} />
            </View>
          </View>
          <View className='flight-soft-line' />
          <View className='flight-soft-line flight-soft-line-wide' />
          <TicketQrCode className='flight-stub-qr-code' text={data?.qrText} />
        </View>
      </View>
    </View>
  );
}

export function FlightBoardingPassTemplate({ data }: FlightTicketTemplateProps) {
  return (
    <View className='flight-boarding-template'>
      <View className='boarding-header'>
        <Text className='boarding-eyebrow'>BOARDING PASS</Text>
        <Text className='boarding-title'>TRAVEL</Text>
      </View>

      <View className='boarding-route'>
        <View className='boarding-city'>
          <Text className='boarding-label'>FROM</Text>
          <FieldValue value={data?.from} className='boarding-city-code' />
        </View>
        <View className='boarding-plane'>
          <PlaneIcon color='#111' />
        </View>
        <View className='boarding-city boarding-city-right'>
          <Text className='boarding-label'>TO</Text>
          <FieldValue value={data?.to} className='boarding-city-code' />
        </View>
      </View>

      <View className='boarding-passenger'>
        <Text className='boarding-label'>PASSENGER</Text>
        <FieldValue value={data?.passenger} className='boarding-passenger-name' />
      </View>

      <View className='boarding-grid'>
        <View className='boarding-info'>
          <Text className='boarding-label'>GATE</Text>
          <FieldValue value={data?.gate} className='boarding-info-value' />
        </View>
        <View className='boarding-info'>
          <Text className='boarding-label'>SEAT</Text>
          <FieldValue value={data?.seat} className='boarding-info-value' />
        </View>
        <View className='boarding-info boarding-info-wide'>
          <Text className='boarding-label'>BOARDING TIME</Text>
          <FieldValue value={data?.boardingTime} className='boarding-info-value' />
        </View>
      </View>

      <View className='boarding-cut-line'>
        {Array.from({ length: 18 }).map((_, index) => (
          <View className='boarding-cut-dot' key={`boarding-dot-${index}`} />
        ))}
      </View>

      <View className='boarding-footer'>
        <View>
          <Text className='boarding-footer-title'>SCAN MEMORY</Text>
          <Text className='boarding-footer-sub'>A SMALL NOTE FROM THE ROAD</Text>
        </View>
        <TicketQrCode className='boarding-qr-code' text={data?.qrText} />
      </View>
    </View>
  );
}

function MovieValue({ value, className = '' }: { value?: string; className?: string }) {
  return <Text className={`movie-value ${value ? '' : 'movie-value-empty'} ${className}`}>{value || ' '}</Text>;
}

function normalizeRating(value?: string) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(5, Math.max(0, Math.round(rating)));
}

export function MovieTicketTemplate({ data }: MovieTicketTemplateProps) {
  const rating = normalizeRating(data?.rating);

  return (
    <View className='movie-ticket-template'>
      <View className='movie-poster-area'>
        {data?.posterUrl ? (
          <Image className='movie-poster-image' mode='aspectFill' src={data.posterUrl} />
        ) : (
          <View className='movie-poster-placeholder'>
            <View className='movie-frame-mark' />
          </View>
        )}
      </View>

      <View className='movie-ticket-body'>
        <View className='movie-side-hole movie-side-hole-left' />
        <View className='movie-side-hole movie-side-hole-right' />

        <View className='movie-title-row'>
          <View className='movie-title-group'>
            <MovieValue value={data?.title} className='movie-title-value' />
            <MovieValue value={data?.subtitle} className='movie-subtitle-value' />
          </View>
          <View className='movie-stars'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Text className={index < rating ? 'movie-star movie-star-active' : 'movie-star'} key={`star-${index}`}>
                ★
              </Text>
            ))}
          </View>
        </View>

        <View className='movie-dash-line' />

        <View className='movie-info-lines'>
          <MovieValue value={data?.category} />
          <MovieValue value={[data?.releaseDate, data?.duration].filter(Boolean).join('  ')} />
        </View>

        <View className='movie-dash-line' />

        <View className='movie-grid'>
          <View className='movie-grid-item'>
            <Text className='movie-label'>HALL:</Text>
            <MovieValue value={data?.hall} />
          </View>
          <View className='movie-grid-item'>
            <Text className='movie-label'>SEAT:</Text>
            <MovieValue value={data?.seat} />
          </View>
          <View className='movie-grid-item'>
            <Text className='movie-label'>PRICE:</Text>
            <MovieValue value={data?.price} />
          </View>
          <View className='movie-grid-item'>
            <Text className='movie-label'>DATE:</Text>
            <MovieValue value={data?.date} />
          </View>
          <View className='movie-grid-item'>
            <Text className='movie-label'>TIME:</Text>
            <MovieValue value={data?.time} />
          </View>
        </View>

        <View className='movie-dash-line' />
        <MovieValue value={data?.quote} className='movie-quote-value' />
        <View className='movie-bottom-teeth'>
          {Array.from({ length: 8 }).map((_, index) => (
            <View className='movie-bottom-hole' key={`movie-hole-${index}`} />
          ))}
        </View>
      </View>
    </View>
  );
}

function TrainValue({ value, className = '' }: { value?: string; className?: string }) {
  return <Text className={`train-value ${value ? '' : 'train-value-empty'} ${className}`}>{value || ' '}</Text>;
}

export function TrainTicketTemplate({ data }: TrainTicketTemplateProps) {
  return (
    <View className='train-ticket-template'>
      <TrainIcon className='train-ticket-bg-mark' />
      <View className='train-ticket-top'>
        <TrainValue value={data?.ticketNo} className='train-ticket-no' />
        <View className='train-waiting'>
          <Text>候车:</Text>
          <TrainValue value={data?.waitingRoom} className='train-inline-value' />
        </View>
      </View>

      <View className='train-route'>
        <View className='train-station train-station-left'>
          <TrainValue value={data?.fromStation} className='train-station-name' />
          <TrainValue value={data?.fromPinyin} className='train-station-pinyin' />
        </View>
        <TrainValue value={data?.trainNo} className='train-number' />
        <View className='train-arrow' />
        <View className='train-station train-station-right'>
          <TrainValue value={data?.toStation} className='train-station-name' />
          <TrainValue value={data?.toPinyin} className='train-station-pinyin' />
        </View>
      </View>

      <View className='train-info-row'>
        <TrainValue value={data?.departureTime} className='train-time' />
        <TrainValue value={data?.carriageSeat} className='train-seat' />
      </View>

      <View className='train-info-row train-info-row-small'>
        <TrainValue value={data?.price} className='train-price' />
        <Text className='train-net'>网</Text>
        <TrainValue value={data?.seatClass} className='train-class' />
      </View>

      <TrainValue value={data?.note} className='train-note' />

      <View className='train-mask'>****</View>
      <View className='train-service-box'>
        <Text>买票请到12306 发货请到95306</Text>
        <Text>中国铁路祝您旅途愉快</Text>
      </View>

      <TicketQrCode className='train-qr' text={data?.qrText} />

      <View className='train-bottom-strip'>
        <TrainValue value={data?.serialNo} className='train-serial' />
        <TrainValue value={data?.saleStation} className='train-sale-station' />
      </View>
    </View>
  );
}

function ScenicValue({ value, className = '' }: { value?: string; className?: string }) {
  return <Text className={`scenic-value ${value ? '' : 'scenic-value-empty'} ${className}`}>{value || ' '}</Text>;
}

export function ScenicTicketTemplate({ data }: ScenicTicketTemplateProps) {
  return (
    <View className='scenic-ticket-template'>
      <View className='scenic-background'>
        {data?.backgroundUrl ? <Image className='scenic-background-image' mode='aspectFill' src={data.backgroundUrl} /> : null}
        <View className='scenic-default-view'>
          <View className='scenic-willow scenic-willow-left' />
          <View className='scenic-willow scenic-willow-right' />
          <View className='scenic-pavilion' />
          <View className='scenic-water-line scenic-water-line-one' />
          <View className='scenic-water-line scenic-water-line-two' />
        </View>
        <View className='scenic-bg-mask' />
      </View>

      <View className='scenic-ticket-card'>
        <View className='scenic-side-hole scenic-side-hole-left' />
        <View className='scenic-side-hole scenic-side-hole-right' />
        <Text className='scenic-admit'>ADMIT ONE</Text>
        <ScenicValue value={data?.title} className='scenic-title' />
        <View className='scenic-subtitle-row'>
          <ScenicValue value={data?.location} className='scenic-subtitle-value' />
          <ScenicValue value={data?.archiveNo} className='scenic-subtitle-value' />
        </View>

        <View className='scenic-dash-line' />

        <View className='scenic-info-grid'>
          <View className='scenic-info-item'>
            <Text className='scenic-label'>DATE</Text>
            <ScenicValue value={data?.date} />
          </View>
          <View className='scenic-info-item scenic-info-item-right'>
            <Text className='scenic-label'>TIME</Text>
            <ScenicValue value={data?.time} />
          </View>
          <View className='scenic-info-item'>
            <Text className='scenic-label'>TICKET TYPE</Text>
            <ScenicValue value={data?.ticketType} />
          </View>
          <View className='scenic-info-item scenic-info-item-right'>
            <Text className='scenic-label'>PRICE</Text>
            <ScenicValue value={data?.price} />
          </View>
        </View>

        <View className='scenic-stamp'>
          <Text className='scenic-stamp-label'>SCANNED</Text>
          <ScenicValue value={data?.scanTime} className='scenic-stamp-time' />
        </View>

        <View className='scenic-solid-line' />
        <View className='scenic-code-row'>
          <TicketQrCode className='scenic-qr-code' text={data?.qrText || DEFAULT_SCENIC_QR_TEXT} />
          <View className='scenic-code-info'>
            <Text className='scenic-code-label'>SCAN TO READ</Text>
            <ScenicValue value={data?.ticketNo} className='scenic-ticket-no' />
          </View>
        </View>
      </View>
    </View>
  );
}
