import { Image, Input, Picker, Text, Textarea, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import type { Ticket, TicketCategory } from '@piaogen/shared';
import { useEffect, useState } from 'react';
import { AppFooter } from '../../components/AppFooter';
import { createTicket, getTicket, updateTicket } from '../../services/tickets';
import './index.less';

const categoryOptions: Array<{
  label: string;
  value: AddCategory;
  icon: string;
}> = [
  { label: '门票', value: 'ticket', icon: '票' },
  { label: '车票', value: 'travel', icon: '车' },
  { label: '电影票', value: 'movie', icon: '影' }
];

const showTemplatePreview = true;
const ticketKindOptions: Array<{ label: string; value: Exclude<TicketCategory, 'movie' | 'travel'> }> = [
  { label: '普通门票', value: 'other' },
  { label: '演唱会', value: 'concert' },
  { label: '景点 / 展览', value: 'exhibition' }
];
const travelKindOptions = ['飞机票模板', '车票模板'];
const defaultTravelQrText = '一路有风，抵达有光。';
const defaultScenicQrText = '人间有趣，值得入场。';

type AddCategory = 'ticket' | 'travel' | 'movie';
type FormCategory = Exclude<TicketCategory, 'travel'>;

type DetailField = {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
};

type FormConfig = {
  titleLabel: string;
  titlePlaceholder: string;
  venueLabel: string;
  venuePlaceholder: string;
  imageLabel?: string;
  details: DetailField[];
};

const movieFields: DetailField[] = [
  { key: 'hall', label: '影厅', placeholder: '例如 3号厅' },
  { key: 'seat', label: '座位', placeholder: '例如 8排12座' },
  { key: 'price', label: '票价', placeholder: '例如 45' },
  { key: 'rating', label: '评分', placeholder: '0-5，最多五颗星' },
  { key: 'duration', label: '片长', placeholder: '例如 180 MIN' }
];

const formConfigMap: Record<Exclude<TicketCategory, 'travel'>, FormConfig> = {
  movie: {
    titleLabel: '电影名称',
    titlePlaceholder: '例如 奥本海默',
    venueLabel: '影院',
    venuePlaceholder: '例如 百丽宫影城',
    imageLabel: '电影海报',
    details: movieFields
  },
  concert: {
    titleLabel: '演出名称',
    titlePlaceholder: '例如 周杰伦嘉年华巡回',
    venueLabel: '场馆',
    venuePlaceholder: '例如 梅赛德斯奔驰文化中心',
    imageLabel: '演出海报',
    details: [
      { key: 'performer', label: '艺人 / 团体', placeholder: '例如 周杰伦' },
      { key: 'hall', label: '区域', placeholder: '例如 内场 A 区' },
      { key: 'seat', label: '座位', placeholder: '例如 12排8座' },
      { key: 'price', label: '票价', placeholder: '例如 880' }
    ]
  },
  exhibition: {
    titleLabel: '展览 / 景点名称',
    titlePlaceholder: '例如 乌菲兹美术馆之巅',
    venueLabel: '展馆 / 景区',
    venuePlaceholder: '例如 上海博物馆',
    imageLabel: '背景图',
    details: [
      { key: 'archiveNo', label: '票号 / 编号', placeholder: '例如 NO.0915' },
      { key: 'ticketType', label: '票种', placeholder: '例如 展览 / 成人票' },
      { key: 'price', label: '票价', placeholder: '例如 88' },
      { key: 'scanTime', label: '入场时间', placeholder: '例如 14:20' },
      { key: 'qrText', label: '二维码文字', placeholder: defaultScenicQrText }
    ]
  },
  other: {
    titleLabel: '门票名称',
    titlePlaceholder: '例如 木心美术馆门票',
    venueLabel: '地点',
    venuePlaceholder: '例如 乌镇西栅',
    imageLabel: '票面图片',
    details: [
      { key: 'ticketType', label: '票种', placeholder: '例如 成人票 / 邀请函' },
      { key: 'archiveNo', label: '编号', placeholder: '例如 PG-2026' },
      { key: 'price', label: '票价', placeholder: '例如 60' },
      { key: 'scanTime', label: '使用时间', placeholder: '例如 10:30' },
      { key: 'qrText', label: '二维码文字', placeholder: defaultScenicQrText }
    ]
  }
};

const flightFields: DetailField[] = [
  { key: 'passenger', label: '乘客', placeholder: '例如 LEMON', required: true },
  { key: 'from', label: '出发地', placeholder: '例如 SHA', required: true },
  { key: 'to', label: '到达地', placeholder: '例如 CTU', required: true },
  { key: 'gate', label: '登机口', placeholder: '例如 A12' },
  { key: 'seat', label: '座位', placeholder: '例如 18F' },
  { key: 'boardingTime', label: '登机时间', placeholder: '例如 09:30' },
  { key: 'qrText', label: '二维码文字', placeholder: defaultTravelQrText }
];

const trainFields: DetailField[] = [
  { key: 'fromStation', label: '出发站', placeholder: '例如 上海虹桥', required: true },
  { key: 'toStation', label: '到达站', placeholder: '例如 杭州东', required: true },
  { key: 'trainNo', label: '车次', placeholder: '例如 G1024', required: true },
  { key: 'waitingRoom', label: '候车室', placeholder: '例如 B6' },
  { key: 'carriageSeat', label: '车厢座位', placeholder: '例如 05车12A号' },
  { key: 'price', label: '票价', placeholder: '例如 ¥73.0' },
  { key: 'seatClass', label: '席别', placeholder: '例如 二等座' },
  { key: 'qrText', label: '二维码文字', placeholder: defaultTravelQrText }
];

function todayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toEventIso(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`).toISOString();
}

function toDateInput(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toTimeInput(value: string) {
  const date = new Date(value);
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');

  return `${hour}:${minute}`;
}

function toAddCategory(category: TicketCategory): AddCategory {
  if (category === 'movie' || category === 'travel') {
    return category;
  }

  return 'ticket';
}

export default function AddTicketPage() {
  const router = useRouter();
  const editingId = router.params.id;
  const [activeCategory, setActiveCategory] = useState<AddCategory>('movie');
  const [ticketKindIndex, setTicketKindIndex] = useState(0);
  const [travelKindIndex, setTravelKindIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [eventDate, setEventDate] = useState(todayDate());
  const [eventTime, setEventTime] = useState('19:30');
  const [imageUrl, setImageUrl] = useState('');
  const [details, setDetails] = useState<Record<string, string>>({});
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(editingId);
  const isTicket = activeCategory === 'ticket';
  const isTravel = activeCategory === 'travel';
  const travelKind = travelKindIndex === 0 ? 'flight' : 'train';
  const selectedTicketCategory = ticketKindOptions[ticketKindIndex].value;
  const submitCategory: TicketCategory = isTicket ? selectedTicketCategory : activeCategory;
  const formCategory: FormCategory = isTicket ? selectedTicketCategory : 'movie';
  const activeConfig = formConfigMap[formCategory];
  const titleLabel = isTravel ? '行程名称' : activeConfig.titleLabel;
  const titlePlaceholder = isTravel ? '例如 上海虹桥-杭州东 / 上海-成都' : activeConfig.titlePlaceholder;
  const venueLabel = isTravel ? (travelKind === 'flight' ? '航班号 / 航司' : '车次') : activeConfig.venueLabel;
  const venuePlaceholder = isTravel ? (travelKind === 'flight' ? '例如 MU5102' : '例如 G1024') : activeConfig.venuePlaceholder;
  const activeDetailFields: DetailField[] = isTravel ? (travelKind === 'flight' ? flightFields : trainFields) : activeConfig.details;

  useEffect(() => {
    if (!editingId) {
      Taro.setNavigationBarTitle({
        title: '添加票根'
      });
      return;
    }

    Taro.setNavigationBarTitle({
      title: '编辑票根'
    });

    getTicket(editingId)
      .then((ticket) => {
        const nextDetails = ticket.details || {};
        const addCategory = toAddCategory(ticket.category);

        setActiveCategory(addCategory);
        setTitle(ticket.title);
        setVenue(ticket.venue);
        setCity(ticket.city || '');
        setEventDate(toDateInput(ticket.eventDate));
        setEventTime(toTimeInput(ticket.eventDate));
        setImageUrl(ticket.imageUrl || '');
        setDetails(nextDetails);
        setNote(ticket.note || '');

        if (addCategory === 'ticket') {
          const nextTicketKindIndex = ticketKindOptions.findIndex((item) => item.value === ticket.category);
          setTicketKindIndex(nextTicketKindIndex >= 0 ? nextTicketKindIndex : 0);
        }

        if (ticket.category === 'travel') {
          setTravelKindIndex(nextDetails.ticketKind === 'train' ? 1 : 0);
        }
      })
      .catch((error) => {
        Taro.showToast({
          title: error instanceof Error ? error.message : '加载失败',
          icon: 'none'
        });
      });
  }, [editingId]);

  const setDetail = (key: string, value: string) => {
    setDetails((current) => ({
      ...current,
      [key]: value
    }));
  };

  const pickImage = async () => {
    try {
      const result = await Taro.chooseImage({
        count: 1,
        sourceType: ['album'],
        sizeType: ['compressed']
      });

      setImageUrl(result.tempFilePaths[0]);
    } catch {
      Taro.showToast({
        title: '已取消',
        icon: 'none'
      });
    }
  };

  const submitTicket = async () => {
    const nextTitle = title.trim();
    const nextVenue = venue.trim();
    const nextCity = city.trim();
    const nextNote = note.trim();
    const nextDetails = activeDetailFields.reduce<Record<string, string>>((result, field) => {
      const value = details[field.key]?.trim();

      if (value) {
        result[field.key] = value;
      }

      return result;
    }, {});

    if (isTravel) {
      nextDetails.ticketKind = travelKind;
      nextDetails.qrText = nextDetails.qrText || defaultTravelQrText;
    }

    if (submitCategory === 'exhibition' || submitCategory === 'other') {
      nextDetails.qrText = nextDetails.qrText || defaultScenicQrText;
    }

    if (submitCategory === 'movie' && nextDetails.rating) {
      const rating = Number(nextDetails.rating);

      if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
        Taro.showToast({
          title: '评分请填写0-5',
          icon: 'none'
        });
        return;
      }

      nextDetails.rating = `${Math.round(rating)}`;
    }

    if (!nextTitle) {
      Taro.showToast({
        title: `请填写${titleLabel}`,
        icon: 'none'
      });
      return;
    }

    if (!nextVenue) {
      Taro.showToast({
        title: '请填写地点',
        icon: 'none'
      });
      return;
    }

    const missingField = activeDetailFields.find((field) => field.required && !nextDetails[field.key]);

    if (missingField) {
      Taro.showToast({
        title: `请填写${missingField.label}`,
        icon: 'none'
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: nextTitle,
        venue: nextVenue,
        eventDate: toEventIso(eventDate, eventTime),
        category: submitCategory,
        imageUrl: isEditing ? imageUrl : imageUrl || undefined,
        city: isEditing ? nextCity : nextCity || undefined,
        note: isEditing ? nextNote : nextNote || undefined,
        details: nextDetails
      };
      const ticket = editingId ? await updateTicket(editingId, payload) : await createTicket(payload);

      Taro.showToast({
        title: editingId ? '已保存' : '已添加',
        icon: 'success'
      });

      Taro.redirectTo({
        url: `/pages/ticket-detail/index?id=${ticket.id}`
      });
    } catch (error) {
      Taro.showToast({
        title: error instanceof Error ? error.message : '添加失败',
        icon: 'none'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openTemplatePreview = () => {
    Taro.navigateTo({
      url: '/pages/ticket-templates/index'
    });
  };

  return (
    <View className='page add-page'>
      <Text className='add-title'>{isEditing ? '编辑票根' : '选择票根类型'}</Text>

      {!isEditing ? (
        <View className='category-scroll'>
          {categoryOptions.map((item) => (
            <View className='category-item' key={item.value} onClick={() => setActiveCategory(item.value)}>
              <View className={`category-icon ${activeCategory === item.value ? 'category-icon-active' : ''}`}>
                <Text>{item.icon}</Text>
              </View>
              <Text className='category-label'>{item.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className='manual-card'>
        {isTicket && !isEditing ? (
          <Picker
            mode='selector'
            range={ticketKindOptions.map((item) => item.label)}
            value={ticketKindIndex}
            onChange={(event) => setTicketKindIndex(Number(event.detail.value))}
          >
            <View className='form-row'>
              <Text className='form-label'>门票类型</Text>
              <Text className='date-value'>{ticketKindOptions[ticketKindIndex].label}</Text>
            </View>
          </Picker>
        ) : null}

        {isTravel && !isEditing ? (
          <Picker
            mode='selector'
            range={travelKindOptions}
            value={travelKindIndex}
            onChange={(event) => setTravelKindIndex(Number(event.detail.value))}
          >
            <View className='form-row'>
              <Text className='form-label'>票根模板</Text>
              <Text className='date-value'>{travelKindOptions[travelKindIndex]}</Text>
            </View>
          </Picker>
        ) : null}

        {!isTravel && activeConfig.imageLabel ? (
          <View className='image-field' onClick={pickImage}>
            {imageUrl ? <Image className='image-preview' mode='aspectFill' src={imageUrl} /> : <View className='image-placeholder' />}
            <View className='image-copy'>
              <Text className='image-title'>{activeConfig.imageLabel}</Text>
              <Text className='image-desc'>{imageUrl ? '已选择图片，点击可更换' : '点击从相册选择，可选'}</Text>
            </View>
          </View>
        ) : null}

        <View className='form-row'>
          <Text className='form-label'>{titleLabel}</Text>
          <Input
            className='form-input'
            maxlength={80}
            placeholder={titlePlaceholder}
            placeholderClass='form-placeholder'
            value={title}
            onInput={(event) => setTitle(event.detail.value)}
          />
        </View>

        <View className='form-row'>
          <Text className='form-label'>{venueLabel}</Text>
          <Input
            className='form-input'
            maxlength={80}
            placeholder={venuePlaceholder}
            placeholderClass='form-placeholder'
            value={venue}
            onInput={(event) => setVenue(event.detail.value)}
          />
        </View>

        <View className='form-grid'>
          <View className='form-row form-row-compact'>
            <Text className='form-label'>城市</Text>
            <Input
              className='form-input'
              maxlength={30}
              placeholder='可选'
              placeholderClass='form-placeholder'
              value={city}
              onInput={(event) => setCity(event.detail.value)}
            />
          </View>

          <Picker mode='date' value={eventDate} onChange={(event) => setEventDate(String(event.detail.value))}>
            <View className='form-row form-row-compact'>
              <Text className='form-label'>日期</Text>
              <Text className='date-value'>{eventDate}</Text>
            </View>
          </Picker>
        </View>

        <Picker mode='time' value={eventTime} onChange={(event) => setEventTime(String(event.detail.value))}>
          <View className='form-row'>
            <Text className='form-label'>时间</Text>
            <Text className='date-value'>{eventTime}</Text>
          </View>
        </Picker>

        <View className='detail-fields'>
          {activeDetailFields.map((field) => (
            <View className='form-row' key={`${submitCategory}-${travelKind}-${field.key}`}>
              <Text className='form-label'>{field.label}</Text>
              <Input
                className='form-input'
                maxlength={80}
                placeholder={field.placeholder}
                placeholderClass='form-placeholder'
                value={details[field.key] || ''}
                onInput={(event) => setDetail(field.key, event.detail.value)}
              />
            </View>
          ))}
        </View>

        <View className='form-row'>
          <Text className='form-label'>备注</Text>
          <Textarea
            className='form-textarea'
            maxlength={500}
            placeholder='座位、同行人、当时的心情，都可以先记在这里'
            placeholderClass='form-placeholder'
            value={note}
            onInput={(event) => setNote(event.detail.value)}
          />
        </View>

        <View className='card-divider' />
        <View className={`submit-button ${submitting ? 'submit-button-disabled' : ''}`} onClick={submitting ? undefined : submitTicket}>
          <Text>{submitting ? '保存中...' : isEditing ? '保存修改' : '保存票根'}</Text>
        </View>
      </View>

      {showTemplatePreview ? (
        <View className='template-entry' onClick={openTemplatePreview}>
          <View className='template-entry-icon' />
          <View className='template-entry-copy'>
            <Text className='template-entry-title'>查看票根模板</Text>
            <Text className='template-entry-desc'>开发预览入口，生产版本不展示</Text>
          </View>
          <Text className='template-entry-arrow'>›</Text>
        </View>
      ) : null}

      <AppFooter active='add' />
    </View>
  );
}
