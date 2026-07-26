FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4180
ENV HOST=0.0.0.0

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY server.mjs ./server.mjs
COPY dist ./dist
COPY THIRD_PARTY_NOTICES.md ./THIRD_PARTY_NOTICES.md

RUN mkdir -p /app/archive && chown -R node:node /app
USER node

EXPOSE 4180
CMD ["npm", "start"]
