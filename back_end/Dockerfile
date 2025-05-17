FROM node:current-alpine

#TODO: toglilo alla fine
RUN apk update && apk add --no-cache git

WORKDIR /app

COPY . .

RUN npm install


CMD ["npm", "start"]