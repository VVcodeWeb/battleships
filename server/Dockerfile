FROM docker.io/node:lts-alpine as builder
RUN apk add --no-cache make gcc g++  python3 
WORKDIR /usr/src/app

COPY ./shared ./shared
COPY ./server ./server

WORKDIR /usr/src/app/shared
RUN npm install

WORKDIR /usr/src/app/server
RUN npm install
RUN npm install -D webpack-cli
RUN npm run build

FROM docker.io/node:lts-alpine
RUN apk add --no-cache dumb-init python3
ENV PORT 3000

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/server/build/ .
COPY --from=builder /usr/src/app/server/node_modules ./node_modules
COPY --from=builder /usr/src/app/server/package.json ./package.json

RUN chown -R node:node .
USER node
EXPOSE 3000
CMD ["dumb-init", "node", "bundle.js"]
