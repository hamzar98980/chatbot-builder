// SocketContext.js
import React, { createContext, useContext } from "react";

import { io } from "socket.io-client";
let ENDPOINT = "http://localhost:3001";

const socket = io(ENDPOINT);

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
