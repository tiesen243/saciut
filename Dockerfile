FROM oven/bun:latest AS builder
WORKDIR /build

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:latest AS runner
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production

COPY --from=builder /build/build ./build
COPY --from=builder /build/dist ./dist

ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
