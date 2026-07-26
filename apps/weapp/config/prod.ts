export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    CLOUD_CONTAINER_ENV: JSON.stringify(process.env.TARO_APP_CLOUD_CONTAINER_ENV || 'prod-d6gkb8nirb8f93b22'),
    CLOUD_CONTAINER_SERVICE: JSON.stringify(process.env.TARO_APP_CLOUD_CONTAINER_SERVICE || 'express-arr6'),
    CLOUD_CONTAINER_API_PREFIX: JSON.stringify(process.env.TARO_APP_CLOUD_CONTAINER_API_PREFIX || '/api')
  },
  mini: {},
  h5: {}
};
