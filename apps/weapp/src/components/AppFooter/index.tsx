import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

type FooterKey = 'home' | 'calendar' | 'add' | 'profile';

interface FooterItem {
  key: FooterKey;
  label: string;
  url: string;
}

const footerItems: FooterItem[] = [
  {
    key: 'home',
    label: '首页',
    url: '/pages/index/index'
  },
  {
    key: 'calendar',
    label: '日历',
    url: '/pages/calendar/index'
  },
  {
    key: 'add',
    label: '添加',
    url: '/pages/add-ticket/index'
  },
  {
    key: 'profile',
    label: '我的',
    url: '/pages/profile/index'
  }
];

interface AppFooterProps {
  active: FooterKey;
}

export function AppFooter({ active }: AppFooterProps) {
  const go = (item: FooterItem) => {
    if (item.key === active) {
      return;
    }

    Taro.reLaunch({
      url: item.url
    });
  };

  return (
    <View className='app-footer'>
      {footerItems.map((item) => (
        <View
          className={`footer-item ${item.key === active ? 'footer-item-active' : ''} ${
            item.key === 'add' ? 'footer-item-add' : ''
          }`}
          key={item.key}
          onClick={() => go(item)}
        >
          <View className={`footer-icon footer-icon-${item.key}`} />
          <Text className='footer-label'>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
