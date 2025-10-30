# Build stage
FROM node:20-alpine AS builder

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/server/package.json ./apps/server/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/

# Install Bun
RUN npm install -g bun@1.3.1

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build packages
RUN bun run build

# Production stage
FROM node:20-alpine AS runner

# Install netcat for health checks and wait scripts
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Install Bun in production image
RUN npm install -g bun@1.3.1

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./

# Copy docker entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server with entrypoint script (runs migrations automatically)
WORKDIR /app/apps/server
ENTRYPOINT ["docker-entrypoint.sh"]
