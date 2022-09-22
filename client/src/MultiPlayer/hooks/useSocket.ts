import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { io, Socket } from "socket.io-client";

import { USER_ID } from "constants/const";
import { ShipType } from "Game/ShipDocks/types";

type Callback = (args: any) => void;
//TODO: get Player type from the backedn
type dataType = {
  userID: string;
  players: any | null[];
};

const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { roomID } = useParams();
  const socketRef = useRef<Socket<any, any> | null>(null);
  const isInRoomRef = useRef<boolean>(false);
  useEffect(() => {
    if (!socketRef.current) socketRef.current = io("ws://localhost:8000");

    socketRef.current.on("connect", () => setIsConnected(true));
    socketRef.current.on("disconnect", () => setIsConnected(false));
    socketRef.current.auth = { userID: window.localStorage.getItem(USER_ID) };

    return () => {
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (roomID && !isInRoomRef.current) {
      socketRef.current?.emit("room:join", roomID);
    }
  };
  const createNewRoom = (callback?: Callback) => {
    if (!callback) {
      socketRef.current?.off("room:new:id");
      return;
    }
    console.log("call room new");
    socketRef.current?.emit("room:new");
    socketRef.current?.on("room:new:id", callback);
  };

  const planningStageListener = (callback?: Callback) => {
    if (!callback) {
      socketRef.current?.off("game:stage:planning");
      return;
    }
    socketRef.current?.on("game:stage:planning", callback);
  };

  const invalidRoomListener = (callback?: Callback) => {
    if (!callback) {
      socketRef.current?.off("room:invalid");
      return;
    }
    socketRef.current?.on("room:invalid", callback);
  };

  const joinedRoomListener = (callback?: Callback) => {
    if (!callback) {
      socketRef.current?.off("room:joined");
      return;
    }
    socketRef.current?.on("room:joined", (data: dataType) => {
      console.log(data);
      isInRoomRef.current = true;
      if (data.userID && socketRef.current) {
        storeUserID(data.userID);
        socketRef.current.auth = { userID: data.userID };
      }

      callback(data);
    });
  };

  const storeUserID = (ID: string) => {
    console.log({ ID });
    window.localStorage.setItem(USER_ID, ID);
  };

  const playerIsReady = (board: ShipType[], callback: Callback) => {
    socketRef.current?.emit("player:ready", board);
    socketRef.current?.on("game:stage:fighting", callback);
    socketRef.current?.on("disconnect", () =>
      socketRef.current?.off("game:stage:fighting")
    );
  };

  const gameLogListener = (callback?: Callback) => {
    if (!callback) {
      socketRef.current?.off("game:gameLog");
      return;
    }
    socketRef.current?.on("game:gameLog", callback);
  };

  const gameOverListener = (callback?: Callback) => {
    if (!callback) {
      socketRef.current?.off("game:stage:over");
      return;
    }
    socketRef.current?.on("game:stage:over", callback);
  };

  const playerTakesTurn = (x: number, y: number) =>
    socketRef.current?.emit("player:move", { x, y });

  const connect = () => socketRef.current?.connect();
  const disconnect = () => socketRef.current?.disconnect();
  return {
    isConnected,
    connect,
    disconnect,
    createNewRoom,
    joinedRoomListener,
    planningStageListener,
    invalidRoomListener,
    playerIsReady,
    playerTakesTurn,
    gameOverListener,
    gameLogListener,
    joinRoom,
    getUserID: () => window.localStorage.getItem(USER_ID),
  };
};

export default useSocket;
