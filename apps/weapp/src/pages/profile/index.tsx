import { Button, Image, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { AuthSession } from '@piaogen/shared';
import { useState } from 'react';
import { AppFooter } from '../../components/AppFooter';
import { AUTH_TOKEN_KEY, getMe, loginWithWechat, logout } from '../../services/auth';
import './index.less';

const APP_VERSION = '0.1.0';

export default function ProfilePage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(false);

  useDidShow(() => {
    const token = Taro.getStorageSync(AUTH_TOKEN_KEY);

    if (!token) {
      setSession(null);
      return;
    }

    getMe()
      .then(setSession)
      .catch(() => {
        Taro.removeStorageSync(AUTH_TOKEN_KEY);
        setSession(null);
      });
  });

  const handleWechatLogin = async () => {
    try {
      setLoading(true);
      const [{ code }, profile] = await Promise.all([
        Taro.login(),
        Taro.getUserProfile({
          desc: '用于展示你的票根账户头像和昵称'
        })
      ]);
      const nextSession = await loginWithWechat({
        code,
        nickname: profile.userInfo.nickName,
        avatarUrl: profile.userInfo.avatarUrl
      });

      Taro.setStorageSync(AUTH_TOKEN_KEY, nextSession.token);
      setSession(nextSession);
      Taro.showToast({
        title: '登录成功',
        icon: 'success'
      });
    } catch (error) {
      Taro.showToast({
        title: error instanceof Error ? error.message : '登录失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const openProfileDetail = () => {
    if (!user) {
      return;
    }

    Taro.navigateTo({
      url: '/pages/profile-detail/index'
    });
  };

  const handleLogout = async () => {
    const confirmed = await Taro.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      confirmText: '退出',
      confirmColor: '#eb3d35'
    });

    if (!confirmed.confirm) {
      return;
    }

    try {
      await logout();
    } catch {
      // Local logout should still succeed when the session has expired.
    }

    Taro.removeStorageSync(AUTH_TOKEN_KEY);
    setSession(null);
  };

  const user = session?.user;

  return (
    <View className='page profile-page'>
      <View className='profile-hero'>
        <View className='avatar-ring' onClick={openProfileDetail}>
          {user?.avatarUrl ? (
            <Image className='profile-avatar-image' mode='aspectFill' src={user.avatarUrl} />
          ) : (
            <Text className='profile-avatar-fallback'>票</Text>
          )}
        </View>
        <Text className='profile-name'>{user?.nickname || '票根收藏者'}</Text>

        {!user ? (
          <Button className='wechat-login-button' loading={loading} onClick={handleWechatLogin}>
            微信快捷登录
          </Button>
        ) : null}
      </View>

      <Text className='section-label'>应用信息</Text>

      <View className='setting-list'>
        <View className='setting-row'>
          <View className='setting-main'>
            <View className='setting-icon setting-icon-version' />
            <Text className='setting-label'>当前版本</Text>
          </View>
          <Text className='setting-value'>v{APP_VERSION}</Text>
        </View>
        <View className='setting-row'>
          <View className='setting-main'>
            <View className='setting-icon setting-icon-doc' />
            <Text className='setting-label'>用户协议</Text>
          </View>
          <Text className='setting-arrow'>›</Text>
        </View>
        <View className='setting-row'>
          <View className='setting-main'>
            <View className='setting-icon setting-icon-lock' />
            <Text className='setting-label'>隐私政策</Text>
          </View>
          <Text className='setting-arrow'>›</Text>
        </View>
      </View>

      {user ? (
        <View className='logout-row' onClick={handleLogout}>
          <View className='logout-icon' />
          <Text>退出登录</Text>
        </View>
      ) : null}

      <AppFooter active='profile' />
    </View>
  );
}
