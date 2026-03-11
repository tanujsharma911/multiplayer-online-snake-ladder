import Board from "@/components/Board";
import Dice from "@/components/ui/Dice";
import RollDice from "@/components/ui/RollDice";
import { cn, labelToCoord, sleep } from "@/lib/utils";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BOARD_DATA } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router";

interface positionsType {
  id: string;
  label: number;
  className: string;
  playing: boolean;
}

const playerData: positionsType[] = [
  {
    id: "1",
    label: 1,
    className: "bg-red-400 border-red-800",
    playing: true,
  },
  {
    id: "2",
    label: 1,
    className: "bg-green-400 border-green-800",
    playing: true,
  },
  {
    id: "3",
    label: 1,
    className: "bg-sky-400 border-sky-800",
    playing: true,
  },
  {
    id: "4",
    label: 1,
    className: "bg-yellow-400 border-yellow-800",
    playing: true,
  },
];

const PlayerCard = (props: {
  players: positionsType[];
  diceRolling: boolean;
  isPlayerMoving: boolean;
  diceNumber: number;
  playerIndex: number;
  turnIndex: number;
  handleRollDice: () => void;
}) => {
  const {
    players,
    diceRolling,
    diceNumber,
    playerIndex,
    handleRollDice,
    turnIndex,
  } = props;

  const turn = playerIndex === turnIndex;
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const checkPlayed = () => {
      if (turnIndex !== playerIndex) {
        setPlayed(false);
      }
    };
    checkPlayed();
  }, [turnIndex]);

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
          turn && !played && "animate-bounce",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <img
                src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=user-${playerIndex + 1}&backgroundColor=ffdfbf`}
                referrerPolicy="no-referrer"
                alt={"player profile"}
                width={45}
                height={45}
                className={cn("rounded-md bg-yellow-200")}
              />
              <div
                className={cn(
                  "absolute -bottom-2 -right-2 w-6 aspect-square rounded-full z-50 border-3 shadow-[4px_4px_0_rgba(1,1,1,0.2)]",
                  players[playerIndex].className,
                )}
              ></div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Player {playerIndex + 1}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {turn && (
        <div className="p-1 bg-zinc-200 rounded-lg flex items-center">
          {diceRolling ? (
            <RollDice />
          ) : (
            <Dice
              onClick={() => {
                handleRollDice();
                setPlayed(true);
              }}
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

let defaultPlayerPositions: positionsType[] = [];

const GameOffline = () => {
  const navigate = useNavigate();

  const [gameStart, setGameStart] = useState(false);
  const [turn, setTurn] = useState(0);
  const [diceNumber, setDiceNumber] = useState(1);
  const [diceRolling, setDiceRolling] = useState(false);
  const [playerCanThrowDice, setPlayerCanThrowDice] = useState(true);
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameoverDialog, setGameoverDialog] = useState(true);
  const [positions, setPositions] = useState<positionsType[]>([]);

  const handleRollDice = async () => {
    if (!playerCanThrowDice) return;
    if (positions[turn].label === 100) return;
    if (!positions[turn].playing) return;

    setPlayerCanThrowDice(false);
    setDiceRolling(true);

    const random = Math.floor(Math.random() * 6) + 1;

    await sleep(400); // Dice rolling animation is currently playing

    setDiceRolling(false);
    setIsPlayerMoving(true);

    setDiceNumber(random);

    // Move the player
    if (positions[turn].label + random <= 100) {
      for (let i = 1; i <= random; i++) {
        await sleep(300);
        setPositions((positions) => {
          const newPositions = [...positions];

          newPositions[turn].label += 1;

          if (newPositions[turn].label === 100) {
            newPositions[turn].playing = false;
          }

          return newPositions;
        });
      }
    }

    // Check Run after animation
    await sleep(300); // Wait for the moving animation to finish

    const { x, y } = labelToCoord(positions[turn].label);

    // Check ladder or snake
    if (BOARD_DATA[y][x] !== -1) {
      setPositions((positions) => {
        const newPositions = [...positions];

        newPositions[turn].label = BOARD_DATA[y][x];

        return newPositions;
      });
    }

    setIsPlayerMoving(false);

    // TODO: Don't remove players
    const playingPlayers = positions.filter((player) => player.playing).length;

    if (playingPlayers === 1) {
      setGameOver(true);
      return;
    }

    let nextTurn = (turn + 1) % positions.length;
    let attempts = 0;

    // Look forward through the positions array to find the next active player.
    // Players who finished in previous rounds will already be false in the 'positions' closure.
    while (
      positions[nextTurn].playing === false &&
      attempts < positions.length
    ) {
      nextTurn = (nextTurn + 1) % positions.length;
      attempts++;
    }

    // Update the turn state exactly once
    setTurn(nextTurn);
    setPlayerCanThrowDice(true);
  };

  const refreshGame = () => {
    console.log("Refresh");
    setPositions(defaultPlayerPositions.map((player) => ({ ...player })));
    setGameoverDialog(true);
    setDiceRolling(false);
    setTurn(0);
    setDiceNumber(1);
    setPlayerCanThrowDice(true);
    setGameOver(false);
    setGameStart(false);
  };

  const startTheGame = (num: number) => {
    setPositions(playerData.map((player) => ({ ...player })).slice(0, num));
    defaultPlayerPositions = playerData
      .map((player) => ({ ...player }))
      .slice(0, num);
    setGameStart(true);
  };

  return gameStart ? (
    <div className="flex flex-col items-center mt-10 pb-10">
      <div className="flex w-full px-2 md:px-10 mb-10">
        <Button
          onClick={() => navigate("/")}
          variant={"destructive"}
          className="font-sm"
        >
          Leave
        </Button>
      </div>
      <div className="w-full max-w-xl">
        {positions.length >= 3 && (
          <div className="flex justify-between">
            <PlayerCard
              players={positions}
              playerIndex={2}
              turnIndex={turn}
              diceNumber={diceNumber}
              diceRolling={diceRolling}
              handleRollDice={handleRollDice}
              isPlayerMoving={isPlayerMoving}
            />
            {positions.length === 4 && (
              <PlayerCard
                players={positions}
                playerIndex={3}
                turnIndex={turn}
                diceNumber={diceNumber}
                diceRolling={diceRolling}
                handleRollDice={handleRollDice}
                isPlayerMoving={isPlayerMoving}
              />
            )}
          </div>
        )}

        <Board className="mx-2" positions={positions} boardData={BOARD_DATA} />

        <div className="flex justify-between">
          <PlayerCard
            players={positions}
            playerIndex={0}
            turnIndex={turn}
            diceNumber={diceNumber}
            diceRolling={diceRolling}
            handleRollDice={handleRollDice}
            isPlayerMoving={isPlayerMoving}
          />
          <PlayerCard
            players={positions}
            playerIndex={1}
            turnIndex={turn}
            diceNumber={diceNumber}
            diceRolling={diceRolling}
            handleRollDice={handleRollDice}
            isPlayerMoving={isPlayerMoving}
          />
        </div>

        <Dialog
          open={gameOver && gameoverDialog}
          onOpenChange={() => {
            refreshGame();
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
  ) : (
    <div className="flex items-center justify-center flex-col gap-10 min-h-80vh px-5 mt-10">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Play Offline
      </h1>
      <div className="bg-white p-6 border rounded-xl flex flex-col items-center gap-6 w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-semibold text-center">
          Select Number Of Players
        </h2>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => startTheGame(2)}>
            Two
          </Button>
          <Button variant="outline" onClick={() => startTheGame(3)}>
            Three
          </Button>
          <Button variant="outline" onClick={() => startTheGame(4)}>
            Four
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOffline;
