import { defineConfig } from '@tarojs/cli';

export default defineConfig(async (merge) => {
  const baseConfig = {
    projectName: 'piaogen-weapp',
    date: '2026-06-29',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {
      API_BASE_URL: JSON.stringify(process.env.TARO_APP_API_BASE_URL || 'http://127.0.0.1:3000/api')
    },
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: 'webpack5',
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {}
  };

  if (process.env.NODE_ENV === 'production') {
    return merge({}, baseConfig, require('./prod').default);
  }

  return merge({}, baseConfig, require('./dev').default);
});
