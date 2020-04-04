FROM node:latest
RUN mkdir /server
COPY . /server
WORKDIR /server
RUN yarn install
CMD ["yarn", "run", "start"]
