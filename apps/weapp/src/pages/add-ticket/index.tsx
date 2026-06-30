import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TicketCategory } from '@piaogen/shared';
import { useState } from 'react';
import { AppFooter } from '../../components/AppFooter';
import { createTicket } from '../../services/tickets';
import './index.less';

const categoryOptions: Array<{
  label: string;
  value: TicketCategory;
  icon: string;
}> = [
  { label: '门票', value: 'other', icon: '票' },
  { label: '飞机票', value: 'travel', icon: '机' },
  { label: '演唱会', value: 'concert', icon: '演' },
  { label: '电影票', value: 'movie', icon: '影' },
  { label: '景点', value: 'exhibition', icon: '景' }
];

function todayIso() {
  return new Date().toISOString();
}

export default function AddTicketPage() {
  const [activeCategory, setActiveCategory] = useState<TicketCategory>('movie');
  const [submitting, setSubmitting] = useState(false);

  const submitTicket = async (title: string, imageUrl?: string) => {
    setSubmitting(true);

    try {
      const ticket = await createTicket({
        title,
        venue: '待补充地点',
        eventDate: todayIso(),
        category: activeCategory,
        imageUrl,
        note: imageUrl ? '从相册导入，等待识别详情。' : '手动录入票根。'
      });

      Taro.showToast({
        title: '已添加',
        icon: 'success'
      });
      Taro.navigateTo({
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

  const handleManualEntry = async () => {
    const result = await Taro.showModal({
      title: '手动录入',
      content: '先创建一张草稿票根，稍后进入详情补充信息。',
      confirmText: '添加'
    });

    if (!result.confirm) {
      return;
    }

    await submitTicket('手动录入票根');
  };

  const handleAlbumImport = async () => {
    try {
      const result = await Taro.chooseImage({
        count: 1,
        sourceType: ['album'],
        sizeType: ['compressed']
      });
      const imageUrl = result.tempFilePaths[0];

      await submitTicket('相册导入票根', imageUrl);
    } catch {
      Taro.showToast({
        title: '已取消',
        icon: 'none'
      });
    }
  };

  const handleCameraArea = () => {
    Taro.showToast({
      title: '拍照识别待接入',
      icon: 'none'
    });
  };

  return (
    <View className='page add-page'>
      <Text className='add-title'>选择票根类型</Text>

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

      <View className='scan-card' onClick={handleCameraArea}>
        <View className='scan-frame'>
          <View className='corner corner-top-left' />
          <View className='corner corner-top-right' />
          <View className='corner corner-bottom-left' />
          <View className='corner corner-bottom-right' />
          <View className='phone-shell'>
            <View className='phone-speaker' />
            <View className='ticket-preview'>
              <View className='ticket-edge ticket-edge-left' />
              <View className='ticket-edge ticket-edge-right' />
              <Text className='ticket-preview-sub'>CINEMA TICKET</Text>
              <Text className='ticket-preview-title'>TICKET</Text>
              <Text className='ticket-preview-code'>NO. 2026</Text>
            </View>
            <View className='camera-button' />
          </View>
          <View className='scan-tools'>
            <Text>闪光灯</Text>
            <Text>变焦</Text>
          </View>
        </View>
      </View>

      <View className='scan-copy'>
        <Text className='scan-title'>将票根放入框内，自动识别详情</Text>
        <Text className='scan-desc'>支持电影票、门票、机票及各类凭证</Text>
      </View>

      <View className='action-grid'>
        <View className={`action-card ${submitting ? 'action-card-disabled' : ''}`} onClick={handleManualEntry}>
          <View className='action-icon action-icon-manual' />
          <Text className='action-title'>手动录入</Text>
        </View>
        <View className={`action-card ${submitting ? 'action-card-disabled' : ''}`} onClick={handleAlbumImport}>
          <View className='action-icon action-icon-album' />
          <Text className='action-title'>相册导入</Text>
        </View>
      </View>

      <AppFooter active='add' />
    </View>
  );
}
