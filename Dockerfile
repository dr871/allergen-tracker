# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Node
FROM node:22-alpine
WORKDIR /app

# Copy package files and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built app and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./

# Create data directory
RUN mkdir -p data

EXPOSE 3000
CMD ["node", "server.js"]
