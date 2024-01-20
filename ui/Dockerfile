FROM node:17-alpine as builder
ARG REACT_APP_API_HOST 
ENV REACT_APP_API_HOST $REACT_APP_API_HOST

WORKDIR /app
COPY ./shared ./shared
COPY ./client ./client

WORKDIR /app/shared
RUN npm install

WORKDIR /app/client
RUN npm install
RUN npm run build

FROM docker.io/nginx:stable-alpine
COPY --from=builder /app/client/build/ ./usr/share/nginx/html/
COPY  ./client/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]