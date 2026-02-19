import {
  DICE_NUMBER,
  GAME_OVER,
  GAME_UPDATE,
  GET_GAME_UPDATE,
  MOVE,
  SET_TURN,
} from "@/lib/messages";
import { useSocketStore } from "@/store/socket";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Board from "@/components/Board";
import { cn } from "@/lib/utils";
import RollDice from "@/components/ui/RollDice";
import Dice from "@/components/ui/Dice";
import { BOARD_DATA } from "@/lib/constants";
import { useUser } from "@/store/user";

const Room = () => {
  const navigate = useNavigate();

  const { roomId } = useParams();
  const { socket } = useSocketStore();
  const { user } = useUser();

  const [gameOver, setGameOver] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState(1);
  const [playerIndex, setPlayerIndex] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [players, setPlayers] = useState<
    ({
      displayName: string;
      email: string;
      avatar?: string;
      playerId: string;
    } | null)[]
  >([]);
  const [playingPlayers, setPlayingPlayers] = useState<
    {
      playerId: string;
      label: number;
      color: string;
      playing: boolean;
    }[]
  >([]);

  const handleRollDice = () => {
    if (!socket) return;

    setDiceRolling(true);
    socket.send(JSON.stringify({ type: MOVE }));
  };

  useEffect(() => {
    const getRoomInfo = () => {
      if (!socket) return;
      socket.send(JSON.stringify({ type: GET_GAME_UPDATE }));
    };
    const handleMessage = (payload: MessageEvent) => {
      const msg = JSON.parse(payload.data);

      console.log("Room ::", msg);

      switch (msg.type) {
        case GAME_UPDATE: {
          setPlayers(msg.players);
          setPlayingPlayers(msg.playingPlayers);
          const playerIndex = msg.playingPlayers.findIndex(
            (player: { playerId: string }) => player!.playerId === user._id,
          );
          setPlayerIndex(playerIndex);
          setTurnIndex(msg.turnIndex);
          break;
        }
        case DICE_NUMBER:
          setDiceRolling(false);
          setDiceNumber(msg.number);
          setTurnIndex(msg.turnIndex);
          break;
        case MOVE:
          if (msg.steps) {
            for (let i = 1; i <= msg.steps; i++) {
              setTimeout(() => {
                setPlayingPlayers((players) => {
                  const newPositions = [...players];

                  newPositions[msg.turnIndex].label += 1;

                  return newPositions;
                });
              }, i * 300);
            }
          } else {
            setPlayingPlayers((players) => {
              const newPositions = [...players];

              newPositions[msg.turnIndex].label = msg.to;

              return newPositions;
            });
          }
          break;
        case SET_TURN:
          setTurnIndex(msg.turnIndex);
          break;
        case GAME_OVER:
          setGameOver(true);
          break;
      }
    };

    getRoomInfo();
    socket?.addEventListener("message", handleMessage);

    return () => {
      socket?.removeEventListener("message", handleMessage);
    };
  }, [socket, roomId]);

  return (
    <div className="flex flex-col items-center mt-10 pb-10">
      <div>
        <Board
          className="w-140"
          positions={playingPlayers}
          boardData={BOARD_DATA}
        />

        <div className="w-12 h-12 bg-zinc-100 flex justify-center items-center m-3 rounded-md">
          {diceRolling ? (
            <RollDice />
          ) : (
            <Dice
              onClick={() => handleRollDice()}
              number={diceNumber}
              playerIndex={playerIndex}
              turnIndex={turnIndex}
            />
          )}
        </div>

        <p className="mb-2">Currently Playing</p>
        <div className="flex flex-col gap-3">
          {[...playingPlayers.map((player) => ({ ...player }))]
            .sort((a, b) => {
              return b.label - a.label; // highest first
            })
            .map((player, i) => {
              return (
                <div
                  key={player.playerId || i}
                  className="bg-zinc-100 flex items-center p-2 gap-3 rounded-md"
                >
                  <div
                    className={cn(
                      "w-6 aspect-square rounded-full z-50 border-3 shadow-[4px_4px_0_rgba(1,1,1,0.2)]",
                      `bg-${player.color}-400 border-${player.color}-800`,
                    )}
                  />
                  <p className="text-xl font-medium">
                    {
                      players.find((p) => player.playerId === p?.playerId)
                        ?.displayName
                    }
                  </p>
                </div>
              );
            })}
        </div>

        <div className="font-mono p-2 my-4 bg-zinc-200">
          turn: {turnIndex}
          <br />
          your index: {playerIndex}
          <br />
          game over: {gameOver}
          <br />
          dice rolling: {diceRolling}
          <br />
          dice number: {diceNumber}
          <br />
          your id: {user._id}
        </div>

        <Dialog
          open={gameOver}
          onOpenChange={() => {
            setGameOver(false);
            navigate("/");
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game Over</DialogTitle>
              <DialogDescription>Close to play again</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Room;
