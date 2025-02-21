FROM oven/bun:1.1.2 as build


WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app /app

EXPOSE 4040

CMD ["bun", "run", "start:prod"]