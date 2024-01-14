import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/types";

//TODO: rewrite to be a RoomFactory?
export abstract class SocketHolder {
  static io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    any
  > | null = null;
}
