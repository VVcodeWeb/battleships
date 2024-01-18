FROM node:17-alpine as builder
WORKDIR /app
COPY ./shared ./shared
COPY ./client ./client

WORKDIR /app/shared
RUN npm install

WORKDIR /app/client
RUN npm install
RUN npm run build

FROM docker.io/nginx:stable-alpine
ARG REACT_APP_IO_PORT 
ENV REACT_APP_IO_PORT $REACT_APP_IO_PORT
COPY --from=builder /app/client/build/ ./usr/share/nginx/html/
COPY  ./client/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]