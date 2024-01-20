FROM docker.io/node:lts-alpine as builder
RUN apk add --no-cache make gcc g++  python3 
WORKDIR /usr/src/app

COPY ./shared ./shared
COPY ./api ./api

WORKDIR /usr/src/app/shared
RUN npm install

WORKDIR /usr/src/app/api
RUN npm install
RUN npm install -D webpack-cli
RUN npm run build

FROM docker.io/node:lts-alpine
RUN apk add --no-cache dumb-init python3
ARG API_PORT 
ENV API_PORT $API_PORT

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/api/build/ .
COPY --from=builder /usr/src/app/api/node_modules ./node_modules
COPY --from=builder /usr/src/app/api/package.json ./package.json

RUN chown -R node:node .
USER node
EXPOSE $API_PORT
CMD ["dumb-init", "node", "bundle.js"]
