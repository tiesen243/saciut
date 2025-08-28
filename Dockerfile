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

COPY --from=builder /build/dist ./dist
EXPOSE 3000
CMD ["bun", "run", "dist/main.js"]
