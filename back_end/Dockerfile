# Usa un'immagine Node.js ufficiale e leggera
FROM node:20-alpine

#TODO: toglilo alla fine
RUN apk update && apk add --no-cache git

WORKDIR /app
COPY package*.json ./


RUN npm install


RUN npm install -g nodemon


COPY . .


CMD ["npm", "start"]