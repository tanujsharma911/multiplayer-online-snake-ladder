import { Button } from "@/components/ui/button";
import { useSocketStore } from "../store/socket";
import { useEffect, useState } from "react";
import {
  LOBBY_UPDATE,
  JOIN,
  GAME_UPDATE,
  LEAVE_LOBBY,
  GAME_OVER,
} from "@/lib/messages";
import { useNavigate } from "react-router";
import { User } from "lucide-react";

const Game = () => {
  const navigate = useNavigate();

  const { socket } = useSocketStore();
  const [waiting, setWaiting] = useState(false);

  const [gameOf, setGameOf] = useState<number | null>(null);
  const [players, setPlayers] = useState<
    { displayName: string; email: string; avatar?: string }[]
  >([]);

  const joinGame = (game_of: number) => {
    if (!socket) return;

    socket.send(JSON.stringify({ type: JOIN, game_of: game_of }));
  };

  const leaveGame = () => {
    if (!socket) return;

    socket.send(JSON.stringify({ type: LEAVE_LOBBY }));
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      console.log("Lobby ::", msg);

      switch (msg.type) {
        case LOBBY_UPDATE:
          setWaiting(true);
          setPlayers(msg.players);
          setGameOf(msg.gameOf);

          break;
        case GAME_UPDATE:
          setWaiting(false);
          setPlayers(msg.players);
          setGameOf(msg.gameOf);
          if (msg.gameStarted) {
            navigate("/room/" + msg.gameId);
          }
          break;
        case LEAVE_LOBBY || GAME_OVER:
          navigate("/");
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      leaveGame();
    };
  }, [socket]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-3">
      {!waiting ? (
        <div className="bg-white p-6 border rounded-xl shadow-sm flex flex-col items-center gap-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center">
            Select Number Of Players
          </h2>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => joinGame(2)}>
              Two
            </Button>
            <Button variant="outline" onClick={() => joinGame(3)}>
              Three
            </Button>
            <Button variant="outline" onClick={() => joinGame(4)}>
              Four
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 border rounded-xl shadow-sm w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-center">
              Match Making...
            </h2>
            <Button variant={"destructive"} onClick={leaveGame}>
              Leave
            </Button>
          </div>
          <p className="flex items-center gap-1 mb-2">
            Game of <User className="size-4!" /> {gameOf}
          </p>

          <ul className="space-y-3">
            {players.map((ply, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg border bg-zinc-50"
              >
                <img
                  src={ply.avatar}
                  alt={ply.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{ply.displayName}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-zinc-500 mt-4 text-center animate-pulse">
            Waiting for players to join...
          </p>
        </div>
      )}
    </div>
  );
};

export default Game;
