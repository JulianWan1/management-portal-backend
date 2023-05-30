FROM node:lts-alpine3.17

WORKDIR /app

COPY ./package.json ./

RUN yarn

COPY . .

CMD yarn && yarn prisma generate --schema=./database/prisma/schema.prisma && yarn start:dev