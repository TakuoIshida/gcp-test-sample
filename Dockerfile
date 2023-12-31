# syntax=docker/dockerfile:1
FROM node:16 AS builder
# ビルドには devDependencies もインストールする必要があるため
ENV NODE_ENV=development
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-stretch-slim AS runner
ARG NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
# NODE_ENV=productionにしてnpm ciするとdevDependenciesがインストールされません
RUN npm ci
COPY --from=builder /app/dist ./dist
CMD ["npm", "run", "start:prod"]