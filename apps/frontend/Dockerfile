FROM oven/bun:1.2

WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lock ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN bun install

# Copy frontend source
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

# Expose Vite dev port
EXPOSE 5173

# Run Vite dev server with host flag for Docker access
CMD ["bun", "run", "dev", "--", "--host"]
