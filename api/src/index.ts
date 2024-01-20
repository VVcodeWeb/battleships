import api from "./api";
import { config } from "./config";
import { socketController } from "./socket";
import consola from "consola";
import http from "http";
import { redis } from "./db/redisDB";
import { SocketHolder } from "./models/SocketHolder";

const io = socketController();
const server = http.createServer(api);

redis.connect();
io.listen(server);
SocketHolder.io = io;
server.listen(config.API_PORT, () => {
  consola.info(
    `SocketIO and Express server are listening on ${config.API_PORT}`
  );
});
