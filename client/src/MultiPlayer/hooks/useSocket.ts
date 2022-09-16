import { ShipType } from "Game/ShipDocks/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
type Callback = (args: any) => void;
const socket = io("ws://localhost:8000");
const useSocket = () => {
  const { roomID: ID } = useParams();
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [roomID, setRoomID] = useState<string>("");
  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    console.log("Socket islistening: " + socket.connected);
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (ID) setRoomID(ID);
  }, [ID]);
  useEffect(() => {
    if (roomID) {
      console.log("join room");
      socket.emit("joinRoom", roomID);
    }
  }, [roomID]);

  const createNewRoom = (callback?: Callback) => {
    if (!callback) {
      socket.off("newRoomID");
      return;
    }
    socket.emit("newRoom");
    socket.on("newRoomID", callback);
  };

  const gameStageListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("stage");
      return;
    }
    socket.on("stage", callback);
  };

  const invalidRoomListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("invalidRoom");
      return;
    }
    socket.on("noRoom", callback);
  };

  const greetingsListener = (callback?: Callback) => {
    if (!callback) {
      socket.off("hi");
      return;
    }
    socket.on("hi", callback);
  };

  const playerIsReady = (board: ShipType[], callback: Callback) => {
    socket.emit("playerReady", board);
    socket.on("bothPlayersReady", callback);
    socket.on("disconnect", () => socket.off("bothPlayersReady"));
  };

  const connect = () => socket.connect();
  const disconnect = () => socket.disconnect();
  return {
    isConnected,
    connect,
    disconnect,
    createNewRoom,
    greetingsListener,
    gameStageListener,
    invalidRoomListener,
    playerIsReady,
    roomID,
  };
};

export default useSocket;
