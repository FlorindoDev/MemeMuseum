FROM node:current-alpine

#TODO: togliere questo selve solo durante lo sviluppo
RUN npm install -g @angular/cli@latest
RUN apk update && apk add --no-cache git


WORKDIR /app

COPY . .

RUN npm install


CMD ["npm", "start"]