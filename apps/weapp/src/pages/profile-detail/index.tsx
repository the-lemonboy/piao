import { Button, Image, Input, Picker, Text, Textarea, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import type { UpdateUserProfilePayload, UserProfile } from '@piaogen/shared';
import { useState } from 'react';
import { IconifyIcon } from '../../components/IconifyIcon';
import { AUTH_TOKEN_KEY, getMe, updateProfile } from '../../services/auth';
import './index.less';

interface ProfileForm {
  nickname: string;
  avatarUrl: string;
  phone: string;
  email: string;
  gender: string;
  birthday: string;
  bio: string;
}

function createProfileForm(user?: UserProfile): ProfileForm {
  return {
    nickname: user?.nickname || '',
    avatarUrl: user?.avatarUrl || '',
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || '',
    birthday: user?.birthday || '',
    bio: user?.bio || ''
  };
}

export default function ProfileDetailPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>(createProfileForm());

  useDidShow(() => {
    const token = Taro.getStorageSync(AUTH_TOKEN_KEY);

    if (!token) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      Taro.navigateBack();
      return;
    }

    getMe()
      .then((nextSession) => {
        setForm(createProfileForm(nextSession.user));
      })
      .catch(() => {
        Taro.removeStorageSync(AUTH_TOKEN_KEY);
        Taro.showToast({
          title: '登录已过期',
          icon: 'none'
        });
        Taro.navigateBack();
      });
  });

  const updateForm = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const chooseAvatar = async () => {
    try {
      const result = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      const avatarUrl = result.tempFilePaths[0];

      if (avatarUrl) {
        updateForm('avatarUrl', avatarUrl);
      }
    } catch {
      // User cancelled avatar selection.
    }
  };

  const handleSaveProfile = async () => {
    if (!form.nickname.trim()) {
      Taro.showToast({
        title: '名字不能为空',
        icon: 'none'
      });
      return;
    }

    const payload: UpdateUserProfilePayload = {
      nickname: form.nickname,
      avatarUrl: form.avatarUrl,
      phone: form.phone,
      email: form.email,
      gender: form.gender,
      birthday: form.birthday,
      bio: form.bio
    };

    try {
      setSaving(true);
      const nextSession = await updateProfile(payload);
      setForm(createProfileForm(nextSession.user));
      Taro.showToast({
        title: '已保存',
        icon: 'success'
      });
    } catch (error) {
      Taro.showToast({
        title: error instanceof Error ? error.message : '保存失败',
        icon: 'none'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className='page profile-detail-page'>
      <View className='detail-hero'>
        <View className='avatar-wrap' onClick={chooseAvatar}>
          <View className='avatar-ring'>
            {form.avatarUrl ? (
              <Image className='profile-avatar-image' mode='aspectFill' src={form.avatarUrl} />
            ) : (
              <Text className='profile-avatar-fallback'>票</Text>
            )}
          </View>
          <View className='camera-badge'>
            <View className='camera-icon'>
              <IconifyIcon color='#ffffff' icon='photo-camera-rounded' />
            </View>
          </View>
        </View>
        <Text className='change-avatar-text'>CHANGE AVATAR</Text>
      </View>

      <View className='profile-card'>
        <View className='profile-field'>
          <View className='field-heading'>
            <Text className='field-title'>名字</Text>
          </View>
          <Input
            className='profile-input'
            maxlength={20}
            placeholder='请输入名字'
            value={form.nickname}
            onInput={(event) => updateForm('nickname', String(event.detail.value))}
          />
        </View>

        <View className='profile-field'>
          <View className='field-heading'>
            <Text className='field-title'>手机号</Text>
          </View>
          <Input
            className='profile-input'
            maxlength={20}
            placeholder='选填'
            type='number'
            value={form.phone}
            onInput={(event) => updateForm('phone', String(event.detail.value))}
          />
        </View>

        <View className='profile-field'>
          <View className='field-heading'>
            <Text className='field-title'>邮箱</Text>
          </View>
          <Input
            className='profile-input'
            maxlength={60}
            placeholder='选填'
            value={form.email}
            onInput={(event) => updateForm('email', String(event.detail.value))}
          />
        </View>

        <View className='profile-field'>
          <View className='field-heading'>
            <Text className='field-title'>性别</Text>
          </View>
          <View className='gender-options'>
            <View className='gender-option' onClick={() => updateForm('gender', '女')}>
              <View className={form.gender === '女' ? 'gender-dot gender-dot-active' : 'gender-dot'} />
              <Text>女</Text>
            </View>
            <View className='gender-option' onClick={() => updateForm('gender', '男')}>
              <View className={form.gender === '男' ? 'gender-dot gender-dot-active' : 'gender-dot'} />
              <Text>男</Text>
            </View>
          </View>
        </View>

        <View className='profile-field'>
          <View className='field-heading'>
            <Text className='field-title'>生日</Text>
          </View>
          <Picker mode='date' value={form.birthday} onChange={(event) => updateForm('birthday', String(event.detail.value))}>
            <View className='birthday-row'>
              <Text className={form.birthday ? 'profile-value' : 'profile-placeholder'}>{form.birthday || '请选择生日'}</Text>
              <View className='calendar-icon'>
                <IconifyIcon color='#202326' icon='calendar-month-rounded' />
              </View>
            </View>
          </Picker>
        </View>

        <View className='profile-field profile-field-bio'>
          <View className='field-heading'>
            <Text className='field-title'>简介</Text>
          </View>
          <Textarea
            className='profile-bio'
            maxlength={60}
            placeholder='一句话介绍自己'
            value={form.bio}
            onInput={(event) => updateForm('bio', String(event.detail.value))}
          />
        </View>

        <View className='card-divider' />
        <Button className='stamp-save-button' loading={saving} onClick={handleSaveProfile}>
          保存资料
        </Button>
      </View>
    </View>
  );
}
