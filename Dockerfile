# --- Stage 1: Build frontend assets with Bun ---
FROM oven/bun:latest AS builder
WORKDIR /build

# Copy package manifest files
COPY package.json .
COPY bun.lock .

# Install dependencies
RUN bun install

# Copy all source files
COPY . .

# Build the application
RUN bun run build

# --- Stage 2: Setup production environment ---
FROM oven/bun:latest AS runner
WORKDIR /app

# Copy package manifest for production install
COPY package.json .

# Install only production dependencies
RUN bun install --production

# Copy built app and assets from builder
COPY --from=builder /build/dist/main.js ./dist/main.js
COPY --from=builder /build/resources/views ./resources/views
COPY --from=builder /build/public ./public

# Expose application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["bun", "--bun", "dist/main.js"]
