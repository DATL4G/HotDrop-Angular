FROM node:latest AS builder
RUN mkdir /build
COPY . /build
WORKDIR /build
RUN npm install
RUN npm run build:prod

FROM nginx:latest

EXPOSE 8080
STOPSIGNAL SIGTERM

COPY --from=builder /build/dist/ /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
