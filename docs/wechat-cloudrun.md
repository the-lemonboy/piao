# 微信云托管部署说明

## 先部署后端

在微信公众平台进入当前小程序：

1. 打开 `开发与服务 -> 云托管`
2. 开通云托管环境
3. 新建服务，例如 `piaogen-api`
4. 代码来源选择当前 GitHub 仓库
5. 构建方式选择 Dockerfile，Dockerfile 路径填 `Dockerfile`
6. 服务端口填 `80`
7. 配置环境变量，参考 `apps/api/.env.cloud.example`
8. 部署

## 必填环境变量

- `WECHAT_APPID`
- `WECHAT_SECRET`
- `DEEPSEEK_API_KEY`
- `DATABASE_URL`

快速体验可先用：

```text
DATABASE_URL=file:/app/data/prod.db
```

但 SQLite 在容器环境里不适合长期保存正式数据，后续建议换成云 MySQL/PostgreSQL。

## 部署后更新小程序接口地址

云托管部署成功后，会得到一个 HTTPS 访问域名。

小程序重新构建时使用：

```bash
TARO_APP_API_BASE_URL=https://你的云托管域名/api pnpm --filter @piaogen/weapp build:weapp
```

然后用微信开发者工具上传新版本。
