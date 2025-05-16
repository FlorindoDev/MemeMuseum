# Usa un'immagine Node.js ufficiale e leggera
FROM node:20-alpine


#TODO toglierlo quando finisci progetto
# Installa Git
RUN apk update && apk add --no-cache git

COPY . /app

# Imposta la directory di lavoro
WORKDIR /app

RUN npm install

CMD ["npm","start"]