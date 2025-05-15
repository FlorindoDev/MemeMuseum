# Usa un'immagine Node.js ufficiale e leggera
FROM node:20-alpine

# Installa Git
RUN apk update && apk add --no-cache git

# Imposta la directory di lavoro
WORKDIR /app