
FROM node:latest-alpine

#TODO: toglilo alla fine
RUN apk update && apk add --no-cache git

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]