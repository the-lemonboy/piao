import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { IconifyIcon } from '../IconifyIcon';
import './index.less';

type FooterKey = 'home' | 'calendar' | 'add' | 'profile';

interface FooterItem {
  key: FooterKey;
  label: string;
  url: string;
  icon: string;
}

const footerItems: FooterItem[] = [
  {
    key: 'home',
    label: '首页',
    url: '/pages/index/index',
    icon: 'home-rounded'
  },
  {
    key: 'calendar',
    label: '日历',
    url: '/pages/calendar/index',
    icon: 'calendar-month-rounded'
  },
  {
    key: 'add',
    label: '添加',
    url: '/pages/add-ticket/index',
    icon: 'add-rounded'
  },
  {
    key: 'profile',
    label: '我的',
    url: '/pages/profile/index',
    icon: 'person-rounded'
  }
];

const activeColor = '#eb3d35';
const inactiveColor = '#8b8a84';

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
          <View className={`footer-icon footer-icon-${item.key}`}>
            <IconifyIcon
              color={item.key === active ? activeColor : inactiveColor}
              icon={item.icon}
            />
          </View>
          <Text className='footer-label'>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
