import { PropsWithChildren } from 'react';
import './app.less';

declare const CLOUD_CONTAINER_ENV: string;
declare const wx: {
  cloud?: {
    init?: (options: { env: string; traceUser?: boolean }) => void;
  };
};

if (typeof wx !== 'undefined' && wx.cloud?.init && CLOUD_CONTAINER_ENV) {
  wx.cloud.init({
    env: CLOUD_CONTAINER_ENV,
    traceUser: true
  });
}

function App({ children }: PropsWithChildren) {
  return children;
}

export default App;
