FROM node:17-alpine as builder
ARG REACT_APP_API_HOST 
ENV REACT_APP_API_HOST $REACT_APP_API_HOST

WORKDIR /app
COPY ./shared ./shared
COPY ./ui ./ui

WORKDIR /app/shared
RUN npm install

WORKDIR /app/ui
RUN npm install
RUN npm run build

FROM docker.io/nginx:stable-alpine
COPY --from=builder /app/ui/build/ ./usr/share/nginx/html/
COPY  ./ui/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]