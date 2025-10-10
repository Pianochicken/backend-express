# 1) Dependencies layer (cacheable)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Prefer npm ci when lockfile exists; fallback to npm i
RUN npm ci || npm i

# 2) Build layer (TypeScript -> dist)
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 3) Development runtime (with dev deps, live reload)
FROM node:22-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci || npm i
# Source will be bind-mounted in docker-compose.dev.yml
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 4) Production runtime (minimal, prod deps only)
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY --from=build /app/dist ./dist
# Serve swagger.json alongside dist
COPY src/swagger.json ./dist/swagger.json
EXPOSE 3000
CMD ["node", "dist/server.js"]
