FROM node:22-alpine

WORKDIR /app

COPY ./package* ./package* 
RUN npm install

COPY . .

