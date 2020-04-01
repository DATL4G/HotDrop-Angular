FROM node:latest
RUN mkdir /server
COPY . /server
WORKDIR /server
RUN npm install
CMD ["npm", "run", "start"]
