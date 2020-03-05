FROM node:lts-alpine

WORKDIR /home/node/app
RUN npm install -g typescript ts-node
VOLUME /home/node/app
COPY ./server /home/node/app

WORKDIR /
