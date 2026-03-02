import { useUser } from "@/store/user";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const WS_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user.isLoggedIn) return;

    const socket = io(WS_SERVER_URL, { withCredentials: true });
    socket.on("connect", () => {
      setSocket(socket);
    });
    socket.on("disconnect", () => {
      setSocket(null);
    });
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return socket;
};
