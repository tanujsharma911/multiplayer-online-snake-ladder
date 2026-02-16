import { Button } from "@/components/ui/button";
import { useSocketStore } from "../store/socket";
import { useEffect, useState } from "react";
import { ADDED, JOIN } from "@/lib/messages";
import { useNavigate } from "react-router";

const Game = () => {
  const navigate = useNavigate();

  const { socket } = useSocketStore();
  const [waiting, setWaiting] = useState(false);

  const [gameOf, setGameOf] = useState(false);
  const [players, setPlayers] = useState<
    { displayName: string; email: string; avatar?: string }[]
  >([]);

  const joinGame = (game_of: number) => {
    if (!socket) return;

    socket.send(JSON.stringify({ type: JOIN, game_of: game_of }));
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      console.log(msg);

      switch (msg.type) {
        case ADDED:
          setWaiting(true);
          setPlayers(msg.players);
          setGameOf(msg.gameOf);

          if (msg.gameStarted) {
            // Redirect player to /room/4a819274-8414-48e5-aea9-bca53ef07c93
            navigate("/room/" + msg.gameId);
          }
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
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
          <h2 className="text-xl font-semibold mb-4 text-center">
            Waiting Lobby
          </h2>
          <p>Board of {gameOf}</p>

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

          <p className="text-sm text-zinc-500 mt-4 text-center">
            Waiting for players to join...
          </p>
        </div>
      )}
    </div>
  );
};

export default Game;
