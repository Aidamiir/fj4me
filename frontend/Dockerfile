FROM oven/bun:latest as build

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["bun", "run", "start"]