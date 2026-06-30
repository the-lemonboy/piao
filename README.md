# 票根小程序

Taro 微信小程序 + Nest API 的 monorepo 基础架构。

## 目录

- `apps/weapp`: Taro 4 + React + TypeScript 微信小程序
- `apps/api`: Nest 后端 API
- `packages/shared`: 前后端共享类型、常量和接口约定

## 快速开始

```bash
pnpm install
pnpm dev:api
pnpm dev:weapp
```

小程序默认请求 `http://127.0.0.1:3000/api`。需要修改时，在启动前设置：

```bash
TARO_APP_API_BASE_URL=http://你的地址/api pnpm dev:weapp
```

## API

- `GET /api/health`: 健康检查
- `GET /api/tickets`: 票根列表
- `GET /api/tickets/:id`: 票根详情
- `POST /api/tickets`: 创建票根

## 下一步建议

- 接入微信登录：小程序 `Taro.login` 获取 code，后端换取 openid/session_key
- 数据库：Nest 接 Prisma + PostgreSQL/MySQL，替换当前内存数据
- 对象存储：票根图片上传到 COS/OSS/S3，数据库只存 URL 和元信息
- 权限：以用户为维度隔离票根数据
# piao
