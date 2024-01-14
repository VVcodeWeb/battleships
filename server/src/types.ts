import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameStage, ServerLogEntry, ShipType } from "../../shared/types";
//TODO: share code with frontend to avoid repeating code

export type IOtype = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
export type Player = {
  id: string;
  ships: ShipType[];
};
export type RoomType = {
  roomID: string;
  owner: Player;
  guest: Player | null;
  stage: GameStage;
  gameLog: ServerLogEntry[];
};

export type Callback = () => void;
