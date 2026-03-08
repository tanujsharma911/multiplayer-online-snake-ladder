import {
  DICE_NUMBER,
  GAME_OVER,
  GAME_UPDATE,
  GET_GAME_UPDATE,
  LEAVE_GAME,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Board from "@/components/Board";
import { cn } from "@/lib/utils";
import RollDice from "@/components/ui/RollDice";
import Dice from "@/components/ui/Dice";
import { BOARD_DATA } from "@/lib/constants";
import { useUser } from "@/store/user";
import { Button } from "@/components/ui/button";
import { GlobeX } from "lucide-react";

interface MessagePayload {
  type: string;
  players: ({
    displayName: string;
    email: string;
    avatar?: string;
    playerId: string;
  } | null)[];
  gameOf: number;
  playingPlayers: {
    playerId: string;
    label: number;
    color: string;
    playing: boolean;
  }[];
  turnIndex: number;
  gameStarted: boolean;
  steps: number;
  number: number;
  gameId: string;
  to: number;
}

const PlayerCard = (props: {
  players?: ({
    displayName: string;
    email: string;
    avatar?: string;
    playerId: string;
  } | null)[];
  playingPlayers?: {
    playerId: string;
    label: number;
    color: string;
    playing: boolean;
  }[];
  currentUserId?: string;
  diceRolling?: boolean;
  isPlayerMoving?: boolean;
  diceNumber?: number;
  playerIndex: number;
  turnIndex?: number;
  handleRollDice?: () => void;
}) => {
  const {
    players,
    playingPlayers,
    currentUserId,
    diceRolling,
    diceNumber,
    playerIndex,
    handleRollDice,
    isPlayerMoving,
    turnIndex,
  } = props;

  const turn = playerIndex === turnIndex;
  const isCurrentUser = currentUserId === players?.[playerIndex]?.playerId;
  const color =
    playingPlayers?.find(
      (pos) => pos.playerId === players?.[playerIndex]?.playerId,
    )?.color || "gray";

  return (
    <div
      className={cn(
        "flex items-center",
        playerIndex % 2 !== 0 && "flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "m-3 rounded-md",
          turn && "ring-3 ring-offset-2  ring-yellow-500",
          turn && isCurrentUser && "animate-bounce",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <img
                src={
                  players?.[playerIndex]?.avatar ||
                  "https://api.dicebear.com/9.x/dylan/jpg"
                }
                referrerPolicy="no-referrer"
                alt={players?.[playerIndex]?.displayName}
                width={45}
                height={45}
                className={cn(
                  "rounded-md",
                  !players?.[playerIndex]?.playerId && "grayscale",
                )}
              />
              {players?.[playerIndex]?.playerId ? (
                <div
                  className={cn(
                    "absolute -bottom-2 -right-2 w-6 aspect-square rounded-full z-50 border-3 shadow-[4px_4px_0_rgba(1,1,1,0.2)]",
                    `bg-${color}-400 border-${color}-800`,
                  )}
                ></div>
              ) : (
                <div className="bg-zinc-50 rounded-full absolute -bottom-2 -right-2">
                  <GlobeX size={20} className="opacity-60" />
                </div>
              )}
            </div>
          </TooltipTrigger>
          {players?.[playerIndex]?.playerId && (
            <TooltipContent>
              <p>{players?.[playerIndex]?.displayName}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
      {(turn || isPlayerMoving) && isCurrentUser && (
        <div className="p-1 bg-zinc-200 rounded-md flex items-center">
          {diceRolling ? (
            <RollDice />
          ) : (
            <Dice
              onClick={() => handleRollDice?.()}
              number={diceNumber}
              playerIndex={playerIndex}
              turnIndex={turnIndex}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Room = () => {
  const navigate = useNavigate();

  const { roomId } = useParams();
  const { socket } = useSocketStore();
  const { user } = useUser();

  const [gameOver, setGameOver] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState(1);
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
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
    setIsPlayerMoving(true);
    socket.emit("message", { type: MOVE });
  };

  const handleLeave = () => {
    if (!socket) return;

    socket.emit("message", { type: LEAVE_GAME });
  };

  useEffect(() => {
    const getRoomInfo = () => {
      if (!socket) return;
      socket.emit("message", { type: GET_GAME_UPDATE });
    };
    const handleMessage = (msg: MessageEvent & MessagePayload) => {
      console.log(msg);
      switch (msg.type) {
        case GAME_UPDATE: {
          setPlayers(msg.players);
          setPlayingPlayers(msg.playingPlayers);
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
                if (i === msg.steps) setIsPlayerMoving(false);
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
        case LEAVE_GAME:
          navigate("/");
          break;
        case GAME_OVER:
          setGameOver(true);
          break;
      }
    };

    getRoomInfo();
    socket?.on("message", handleMessage);

    return () => {
      socket?.off("message", handleMessage);
    };
  }, [socket, roomId]);

  return (
    <div className="flex flex-col items-center mt-10 pb-10">
      <div className="flex w-full px-2 md:px-10 mb-10">
        <Button
          onClick={handleLeave}
          variant={"destructive"}
          className="font-sm"
        >
          Leave
        </Button>
      </div>
      <div className="w-full">
        {players.length >= 3 && (
          <div className="flex justify-between">
            <PlayerCard
              playingPlayers={playingPlayers}
              players={players}
              playerIndex={2}
              turnIndex={turnIndex}
              diceNumber={diceNumber}
              diceRolling={diceRolling}
              handleRollDice={handleRollDice}
              isPlayerMoving={isPlayerMoving}
              currentUserId={user._id}
            />
            {players.length === 4 && (
              <PlayerCard
                playingPlayers={playingPlayers}
                players={players}
                playerIndex={3}
                turnIndex={turnIndex}
                diceNumber={diceNumber}
                diceRolling={diceRolling}
                handleRollDice={handleRollDice}
                isPlayerMoving={isPlayerMoving}
                currentUserId={user._id}
              />
            )}
          </div>
        )}

        <Board
          className="mx-2"
          positions={playingPlayers}
          boardData={BOARD_DATA}
        />

        <div className="flex justify-between">
          <PlayerCard
            playingPlayers={playingPlayers}
            players={players}
            playerIndex={0}
            turnIndex={turnIndex}
            diceNumber={diceNumber}
            diceRolling={diceRolling}
            handleRollDice={handleRollDice}
            isPlayerMoving={isPlayerMoving}
            currentUserId={user._id}
          />
          <PlayerCard
            playingPlayers={playingPlayers}
            players={players}
            playerIndex={1}
            turnIndex={turnIndex}
            diceNumber={diceNumber}
            diceRolling={diceRolling}
            handleRollDice={handleRollDice}
            isPlayerMoving={isPlayerMoving}
            currentUserId={user._id}
          />
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
              <DialogDescription>
                Click the close button for going to home page
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Room;
