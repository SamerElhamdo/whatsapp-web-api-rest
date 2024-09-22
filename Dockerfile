# --------------------- Install dependencies and build
FROM node:20-alpine3.17 AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
RUN yarn global add pnpm && pnpm install --no-frozen-lockfile;
COPY . .

RUN yarn build

# --------------------- Production image
FROM node:20-alpine3.17 AS runner
ARG APP_PORT
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
RUN apk --no-cache add libc6-compat

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/public ./public

# Create and set permissions for auth_info directory
RUN mkdir /app/auth_info \
  && chown nestjs:nodejs /app/auth_info \
  && chmod 775 /app/auth_info 

USER nestjs

EXPOSE $APP_PORT
ENV PORT=$APP_PORT

CMD [ "node", "dist/main.js" ]