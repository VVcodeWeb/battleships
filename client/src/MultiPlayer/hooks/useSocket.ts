import { ShipType } from "Game/ShipDocks/types";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("ws://localhost:8000");
type Callback = (args: any) => void;
const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const { roomID } = useParams();
  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const joinRoom = () => {
    if (roomID) {
      //console.log("join room");
      socket.emit("room:join", roomID);
    }
  };
  const createNewRoom = (callback?: Callback) => {
    if (!callback) {
      socket.off("room:new:id");
      return;
    }
    socket.emit("room:new");
    socket.on("room:new:id", callback);
  };

  const planningStageListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("game:stage:planning");
      return;
    }
    socket.on("game:stage:planning", callback);
  };

  const invalidRoomListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("room:invalid");
      return;
    }
    socket.on("room:invalid", callback);
  };

  const greetingsListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("hi");
      return;
    }
    socket.on("hi", callback);
  };

  const playerIsReady = (board: ShipType[], callback: Callback) => {
    socket.emit("player:ready", board);
    socket.on("game:stage:fighting", callback);
    socket.on("disconnect", () => socket.off("game:stage:fighting"));
  };

  const gameLogListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("game:gameLog");
      return;
    }
    socket.on("game:gameLog", callback);
  };

  const gameOverListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("game:stage:over");
      return;
    }
    socket.on("game:stage:over", callback);
  };

  const playerTakesTurn = (x: number, y: number) =>
    socket.emit("player:move", { x, y });

  const connect = () => socket.connect();
  const disconnect = () => socket.disconnect();
  return {
    isConnected,
    connect,
    disconnect,
    createNewRoom,
    greetingsListener,
    planningStageListener,
    invalidRoomListener,
    playerIsReady,
    playerTakesTurn,
    gameOverListener,
    gameLogListener,
    joinRoom,
    socketID: socket.id,
  };
};

export default useSocket;
