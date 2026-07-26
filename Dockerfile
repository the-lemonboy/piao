FROM node:22-bookworm-slim

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV PORT=80
ENV DATABASE_URL=file:/app/data/prod.db

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/weapp/package.json apps/weapp/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile --prod=false

COPY apps/api apps/api
COPY packages/shared packages/shared

RUN pnpm build:shared \
  && pnpm --filter @piaogen/api prisma:generate \
  && pnpm --filter @piaogen/api build

ENV NODE_ENV=production

EXPOSE 80

CMD ["sh", "-c", "mkdir -p /app/data && pnpm --filter @piaogen/api exec prisma db push && pnpm --filter @piaogen/api db:seed && pnpm --filter @piaogen/api start:prod"]
