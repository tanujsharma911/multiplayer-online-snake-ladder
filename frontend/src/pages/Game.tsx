import { Button } from "@/components/ui/button";
import { useSocketStore } from "../store/socket";
import { useEffect, useState } from "react";
import { ADDED, JOIN } from "@/lib/messages";

const Game = () => {
  const { socket } = useSocketStore();
  const [joined, setJoined] = useState(false);
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
          setJoined(true);
          setPlayers(msg.players);
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
    <div>
      {!joined ? (
        <div className="bg-zinc-100 p-2 py-8 border rounded-lg flex gap-4 max-w-4xl mx-3 md:mx-auto">
          <div className="flex flex-col justify-between items-center w-full">
            <h2 className="scroll-m-20 mb-8 text-3xl font-semibold tracking-tight first:mt-0">
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
        </div>
      ) : (
        <div>
          <ul>
            {players &&
              players.map((ply, i) => <li key={i}>{ply.displayName}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Game;
