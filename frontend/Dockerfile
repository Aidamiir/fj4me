FROM oven/bun:latest as build

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun build

FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "start"]