FROM oven/bun:latest as build

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun build

FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4040

CMD ["bun", "start:prod"]