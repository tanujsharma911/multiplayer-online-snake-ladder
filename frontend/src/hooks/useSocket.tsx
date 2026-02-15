import { useUser } from "@/store/user";
import { useEffect, useState } from "react";

export const useSocket = () => {
  const WS_SERVER_URL = import.meta.env.VITE_WS_SERVER_URL;

  const { user } = useUser();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!user.isLoggedIn) return;

    const ws = new WebSocket(WS_SERVER_URL);
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return socket;
};
