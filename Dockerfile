FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/ apps/
COPY packages/ packages/
COPY turbo.json tsconfig.base.json ./
RUN npm ci
RUN npx turbo build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/ ./packages/
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
