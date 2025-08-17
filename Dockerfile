FROM node:20 AS base

FROM base AS deps
RUN apt-get update && \
    apt-get install -y \
      python3 \
      make \
      g++ \
      pkg-config \
      libusb-1.0-0-dev \
      libudev-dev \
      && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dist/static ./dist/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
