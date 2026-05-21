# 集享公社管理后台

基于 Vue 3 + TypeScript + Element Plus 的电商运营管理后台，对接集享公社 API。

## 功能模块

- 数据看板、用户管理、商品/分类、订单、理财、提现
- 工单、系统配置、等级、退款、推荐

## 本地开发

```bash
pnpm install
pnpm dev
```

默认 http://localhost:3006 ，API 代理见 `.env.development`。

## 生产部署

- 构建：`pnpm build`
- 部署路径：`/admin/`（见 `.env.production`）
- 默认管理员：`admin` / `admin123`（以服务端配置为准）

## 线上地址

- 管理后台：http://47.96.102.163/admin
- 用户端商城：http://47.96.102.163/mall
- API：http://47.96.102.163/api/v1
