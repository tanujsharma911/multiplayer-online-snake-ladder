import { Button } from "@/components/ui/button";
import { useSocketStore } from "../store/socket";
import {
  CREATE_ROOM,
  GAME_UPDATE,
  GET_GAME_UPDATE,
  JOIN_ROOM,
  LEAVE_LOBBY,
  LOBBY_UPDATE,
} from "@/lib/messages";
import { useEffect, useState } from "react";
import { useUser } from "@/store/user";
import { useNavigate } from "react-router";
import { Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessagePayload {
  type: string;
  players: { displayName: string; email: string; avatar?: string }[];
  gameOf: number;
  gameStarted: boolean;
  gameId: string;
}

const CreateGame = (props: { createGameOf: (gameOf: number) => void }) => {
  const { createGameOf } = props;
  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Create Room
      </h1>
      <div className="bg-white p-6 border rounded-xl flex flex-col items-center gap-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center">
          Select Number Of Players
        </h2>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => createGameOf(2)}>
            Two
          </Button>
          <Button variant="outline" onClick={() => createGameOf(3)}>
            Three
          </Button>
          <Button variant="outline" onClick={() => createGameOf(4)}>
            Four
          </Button>
        </div>
      </div>
    </>
  );
};

const JoinGame = (props: { joinGame: (id: string) => void }) => {
  const { joinGame } = props;

  const [gameId, setGameId] = useState("");

  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Join Room
      </h1>
      <div className="bg-white p-6 border rounded-xl flex items-center gap-6 w-full max-w-md">
        <Input
          type="text"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="h-full py-2"
        />
        <Button onClick={() => joinGame(gameId)} className="py-2">
          Join
        </Button>
      </div>
    </>
  );
};

const Joined = (props: {
  players: { displayName: string; email: string; avatar?: string }[];
  gameId: string | null;
  gameOf: number | null;
  handleGameLeave: () => void;
}) => {
  const { players, gameId, gameOf, handleGameLeave } = props;
  return (
    <div className="bg-white p-6 border rounded-xl w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-center">Match Making</h2>
          <p className="flex items-center gap-1 opacity-75">
            <Globe size={18} /> Private
          </p>
        </div>
        <Button variant={"destructive"} onClick={handleGameLeave}>
          Leave
        </Button>
      </div>

      <ul className="space-y-3">
        {players.map((ply, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg border bg-zinc-50"
          >
            <img
              src={ply.avatar}
              alt={ply.displayName}
              className="w-8 h-8 rounded-full object-cover outline"
            />
            <span className="font-medium">{ply.displayName}</span>
          </li>
        ))}
        {Array.from(
          { length: (gameOf || 2) - players.length },
          (_, i) => i,
        ).map((_, i) => {
          return (
            <div
              key={i}
              className="h-12 w-full border rounded-lg border-dashed"
            ></div>
          );
        })}
      </ul>

      <div className="flex items-baseline justify-between">
        <p>
          Game ID: <strong>{gameId}</strong>
        </p>
        <p className="text-sm text-zinc-500 mt-4 text-center animate-pulse">
          Waiting for players to join...
        </p>
      </div>
    </div>
  );
};

const CustomLobby = (props: { create?: boolean; join?: boolean }) => {
  const { create, join } = props;

  const { socket } = useSocketStore();
  const { user } = useUser();
  const navigate = useNavigate();

  const [gameJoined, setGameJoined] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);

  const [gameOf, setGameOf] = useState<number | null>(null);
  const [players, setPlayers] = useState<
    { displayName: string; email: string; avatar?: string }[]
  >([]);

  const createGameOf = (gameOf: number) => {
    if (!socket) return;

    socket.emit("message", { type: CREATE_ROOM, gameOf: gameOf });
  };

  const joinGame = (id: string) => {
    if (!socket) return;

    socket.emit("message", { type: JOIN_ROOM, gameId: id });
  };

  const handleLeave = () => {
    if (!socket) return;
    socket.emit("message", { type: LEAVE_LOBBY, gameId: gameId! });
    navigate("/");
  };

  useEffect(() => {
    if (!user.isLoggedIn) navigate("/login");
    if (!socket) return;

    const getRoomInfo = () => {
      if (!socket) return;
      socket.emit("message", { type: GET_GAME_UPDATE });
    };

    const handleMessages = (msg: MessageEvent & MessagePayload) => {
      console.log("CustomLobby.tsx ::", msg);
      switch (msg.type) {
        case LOBBY_UPDATE:
          setGameJoined(true);
          setGameId(msg.gameId);
          setGameOf(msg.gameOf);
          setPlayers(msg.players);
          break;
        case GAME_UPDATE:
          navigate("/room/" + msg.gameId);
          break;
      }
    };

    getRoomInfo();

    socket.on("message", handleMessages);

    return () => {
      socket.off("message", handleMessages);
    };
  }, [socket, user]);

  return (
    <div className="my-20 flex items-center flex-col justify-center gap-10 px-3">
      {create && !gameJoined && <CreateGame createGameOf={createGameOf} />}
      {join && !gameJoined && <JoinGame joinGame={joinGame} />}
      {gameJoined && (
        <Joined
          gameOf={gameOf}
          gameId={gameId}
          players={players}
          handleGameLeave={handleLeave}
        />
      )}
    </div>
  );
};

export default CustomLobby;
