import { Image } from '@tarojs/components';
import './index.less';

interface IconifyIconProps {
  icon: string;
  color?: string;
  size?: number;
  className?: string;
}

const iconPaths: Record<string, string[]> = {
  'home-rounded': [
    'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z'
  ],
  'calendar-month-rounded': [
    'M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm13 8H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9ZM7 12h3v3H7v-3Zm5 0h3v3h-3v-3Zm5 0h2v3h-2v-3ZM7 16h3v2H7v-2Zm5 0h3v2h-3v-2Z'
  ],
  'add-rounded': [
    'M12 3a2 2 0 0 1 2 2v5h5a2 2 0 1 1 0 4h-5v5a2 2 0 1 1-4 0v-5H5a2 2 0 1 1 0-4h5V5a2 2 0 0 1 2-2Z'
  ],
  'person-rounded': [
    'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.25-8 5v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1c0-2.75-3.6-5-8-5Z'
  ],
  'chevron-left-rounded': [
    'M14.7 5.3a1 1 0 0 1 0 1.4L9.4 12l5.3 5.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z'
  ],
  'chevron-right-rounded': [
    'M9.3 18.7a1 1 0 0 1 0-1.4l5.3-5.3-5.3-5.3a1 1 0 1 1 1.4-1.4l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0Z'
  ],
  'photo-camera-rounded': [
    'M9 4a2 2 0 0 0-1.8 1.1L6.5 6.5H5a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9.5a3 3 0 0 0-3-3h-1.5l-.7-1.4A2 2 0 0 0 15 4H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
  ],
  'info-rounded': [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 8a1.4 1.4 0 0 1 1.4 1.4v5.2a1.4 1.4 0 1 1-2.8 0v-5.2A1.4 1.4 0 0 1 12 10Zm0-4.2a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1Z'
  ],
  'feedback-rounded': [
    'M4 4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h2.4l3.5 3.1a1 1 0 0 0 1.6-.8V18H20a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H4Zm4 6h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2Zm0-3h10a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2Z'
  ],
  'delete-sweep-rounded': [
    'M9 3h6l1 2h4a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2h4l1-2Zm-3 6h12l-.8 11a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 9Zm-4 2h3v2H2v-2Zm0 4h3v2H2v-2Zm0 4h3v2H2v-2Z'
  ],
  'logout-rounded': [
    'M5 3h7a2 2 0 0 1 2 2v3a1 1 0 1 1-2 0V5H5v14h7v-3a1 1 0 1 1 2 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm12.6 5.4 3 3a1 1 0 0 1 0 1.4l-3 3a1 1 0 1 1-1.4-1.4l1.3-1.3H9a1 1 0 1 1 0-2h8.5l-1.3-1.3a1 1 0 1 1 1.4-1.4Z'
  ],
  'edit-rounded': [
    'M4 17.2V20h2.8L17.9 8.9l-2.8-2.8L4 17.2Zm16.7-11.1a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1.2 1.2 2.8 2.8 1.2-1.2Z'
  ],
  'delete-rounded': [
    'M9 3h6l1 2h4a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2h4l1-2Zm-2 6h10l-.8 11a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 9Z'
  ]
};

const sourceCache = new Map<string, string>();

function toSvgSource(icon: string, color: string) {
  const cacheKey = `${icon}:${color}`;
  const cached = sourceCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const paths = iconPaths[icon];

  if (!paths) {
    return '';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${paths
    .map((path) => `<path fill="${color}" d="${path}"/>`)
    .join('')}</svg>`;
  const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  sourceCache.set(cacheKey, source);
  return source;
}

export function IconifyIcon({ icon, color = 'currentColor', size, className = '' }: IconifyIconProps) {
  const source = toSvgSource(icon, color);

  if (!source) {
    return null;
  }

  return (
    <Image
      className={`iconify-icon ${className}`}
      mode='aspectFit'
      src={source}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
    />
  );
}
