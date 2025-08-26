FROM oven/bun:latest AS builder
WORKDIR /build

COPY package.json .
COPY bun.lock .

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:latest AS runner
WORKDIR /app

COPY package.json .
RUN bun install --production

COPY --from=builder /build/dist/main.js ./dist/main.js
COPY --from=builder /build/resources/views ./resources/views
COPY --from=builder /build/public ./public

CMD ["bun", "run", "start"]
