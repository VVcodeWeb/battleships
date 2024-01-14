import configuration from "config/configuration";
import { USER_ID } from "shared/constants";
import { ServerToClientEvents, ClientToServerEvents } from "shared/types";
import React, { memo, useEffect } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `ws://${configuration().api}`,
  {
    auth: { userId: window.localStorage.getItem(USER_ID) },
    autoConnect: false,
  }
);
export const SocketContext = React.createContext<SocketContextType>({
  socket: socket,
});

const SocketProvider = ({ children }: any) => {
  useEffect(() => {
    console.log(socket.connected);
    socket.auth = { userId: window.localStorage.getItem(USER_ID) };
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default memo(SocketProvider);
