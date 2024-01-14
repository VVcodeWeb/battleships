import {
  BATTLESHIP,
  FRIGATE,
  DROMON_A,
  DROMON_B,
  PATROL_BOAT_A,
  PATROL_BOAT_B,
  WAITING_FOR_PLAYERS,
  PLANNING,
  READY,
  FIGHTING,
  GAME_OVER,
  PART_0,
  PART_1,
  PART_2,
  PART_3,
  PART_4,
  VERTICAL,
  HORIZONTAL,
  CARAVELA,
} from "./constants";
export type GameStage =
  | typeof WAITING_FOR_PLAYERS
  | typeof PLANNING
  | typeof READY
  | typeof FIGHTING
  | typeof GAME_OVER;

export type FightingStageData = {
  firstMove: string;
};

export type GameOverData = {
  winner: string;
  winnerShips: ShipType[];
  loserShips: ShipType[];
};

export interface ServerToClientEvents {
  ["stage:set"]: (
    stage: GameStage,
    data?: FightingStageData | GameOverData
  ) => void;
  ["game:update"]: (gameLog: ServerLogEntry[]) => void;
}

//TODo: types for resposne
export type EventAckn = (response: {
  error?: any;
  status: "ok" | "error";
}) => void;
export interface ClientToServerEvents {
  //todo: add callback wityh errors to the room join event
  ["room:join"]: (roomdId: string, callback: EventAckn) => void;
  ["player:ready"]: (
    roomId: string,
    ships: ShipType[],
    callback: EventAckn
  ) => void;
  ["player:move"]: (
    roomId: string,
    { x: number, y: number },
    callback: EventAckn
  ) => void;
}

export type ShipNames =
  | typeof BATTLESHIP
  | typeof FRIGATE
  | typeof CARAVELA
  | typeof DROMON_A
  | typeof DROMON_B
  | typeof PATROL_BOAT_A
  | typeof PATROL_BOAT_B;
export interface Coordinates {
  x: number;
  y: number;
}
export type ShipPartType =
  | null
  | typeof PART_0
  | typeof PART_1
  | typeof PART_2
  | typeof PART_3
  | typeof PART_4;
export type ShipOrientation = typeof VERTICAL | typeof HORIZONTAL;
export type ShipType = {
  x: number;
  y: number;
  damaged: boolean;
  name: ShipNames;
  part: ShipPartType;
  orientation: ShipOrientation;
};
export type Player = typeof ENEMY | typeof ALLY;

type LogEntry = {
  x: number;
  y: number;
  success: boolean;
  destroyed: ShipType[] | null;
  timestamp: number;
};
export type ServerLogEntry = LogEntry & {
  player: string;
};

export type ClientLogEntry = LogEntry & {
  player: Player;
};
