FROM node:22.14.0 as build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22.14.0

WORKDIR /app
COPY --from=build /app /app

EXPOSE 3000
CMD ["npm", "run", "start"]