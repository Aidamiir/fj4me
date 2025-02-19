FROM oven/bun:latest as build

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app /app

EXPOSE 4040

CMD ["bun", "run", "start:prod"]