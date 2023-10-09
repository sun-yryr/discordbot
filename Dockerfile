FROM node:18-alpine as builder
WORKDIR /app
# Configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/downloader/package.json packages/downloader/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build
COPY . .
RUN pnpm run -r build
# Outputs standalone "node_modules" directory. This "node_modules" is not dependent on the root store
RUN pnpm --filter discordbot-downloader deploy --prod deploy/downloader

# ------------------------------------------------------------------------------
# Production Images
# ------------------------------------------------------------------------------
FROM jauderho/yt-dlp:2023.10.07 as discordbot-downloader
COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /app/deploy/downloader/package.json /app/packages/downloader/package.json
COPY --from=builder /app/deploy/downloader/node_modules /app/packages/downloader/node_modules
COPY --from=builder /app/deploy/downloader/dist /app/packages/downloader/dist
WORKDIR /app/packages/downloader
ENV YT_DLP_PATH=/usr/local/bin/yt-dlp
ENTRYPOINT ["node"]
CMD ["dist/main.js"]
