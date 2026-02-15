import Board from "@/components/Board";
import Dice from "@/components/ui/Dice";
import RollDice from "@/components/ui/RollDice";
import { cn, labelToCoord } from "@/lib/utils";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const BOARD: number[][] = [
  [-1, -1, -1, 76, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, 93, -1, -1, -1],
  [-1, -1, -1, 42, -1, -1, -1, -1, -1, -1],
  [-1, 98, -1, -1, -1, -1, -1, 32, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, 75, -1, -1],
  [-1, -1, -1, -1, -1, -1, 16, -1, -1, -1],
  [-1, -1, -1, 56, -1, -1, -1, -1, -1, -1],
  [-1, 4, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 28, -1],
];

interface positionsType {
  id: string;
  label: number;
  className: string;
}

const playerData: positionsType[] = [
  {
    id: "1",
    label: 90,
    className: "bg-red-400 border-red-800",
  },
  {
    id: "2",
    label: 90,
    className: "bg-green-400 border-green-800",
  },
  {
    id: "3",
    label: 90,
    className: "bg-sky-400 border-sky-800",
  },
  {
    id: "4",
    label: 90,
    className: "bg-yellow-400 border-yellow-800",
  },
];

let defaultPlayerPositions: positionsType[] = [];

const GameOffline = () => {
  const [gameStart, setGameStart] = useState(false);
  const [turn, setTurn] = useState(0);
  const [diceNumber, setDiceNumber] = useState(1);
  const [diceRolling, setDiceRolling] = useState(false);
  const [playerCanPlay, setPlayerCanPlay] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameoverDialog, setGameoverDialog] = useState(true);
  const [positions, setPositions] = useState<positionsType[]>([]);

  const handleRollDice = () => {
    if (!playerCanPlay) return;

    setPlayerCanPlay(false);
    setDiceRolling(true);

    const random = Math.floor(Math.random() * 6) + 1;

    // Run after 0.4 sec
    setTimeout(() => {
      setDiceRolling(false);

      setDiceNumber(random);

      // Go to that label
      if (positions[turn] && positions[turn]?.label + random <= 100) {
        for (let i = 1; i <= random; i++) {
          setTimeout(() => {
            setPositions((positions) => {
              const newPositions = [...positions];

              newPositions[turn].label += 1;

              return newPositions;
            });
          }, i * 300);
        }
      }

      // Check Run after animation
      setTimeout(
        () => {
          const { x, y } = labelToCoord(positions[turn]?.label);

          // Check ladder or snake
          if (BOARD[y][x] !== -1) {
            setPositions((positions) => {
              const newPositions = [...positions];

              newPositions[turn].label = BOARD[y][x];

              return newPositions;
            });
          }

          setPositions((players) => {
            // TODO: Don't remove players
            const playingPlayers = players.filter(
              (player) => player.label !== 100,
            );

            if (playingPlayers.length == 1) {
              setGameOver(true);
            }

            setTurn((prev) => (prev + 1) % playingPlayers.length);

            return playingPlayers;
          });

          setPlayerCanPlay(true);
        },
        random * 300 + 300,
      );
    }, 400);
  };

  const refreshGame = () => {
    console.log("Refresh");
    setPositions(defaultPlayerPositions.map((player) => ({ ...player })));
    setGameoverDialog(true);
    setDiceRolling(false);
    setTurn(0);
    setDiceNumber(1);
    setPlayerCanPlay(true);
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
      <div>
        <Board className="w-140" positions={positions} boardData={BOARD} />

        <div className="w-12 h-12 bg-zinc-100 flex justify-center items-center m-3 rounded-md">
          {diceRolling ? (
            <RollDice />
          ) : (
            <Dice onClick={() => handleRollDice()} number={diceNumber} />
          )}
        </div>

        <p className="mb-2">Currently Playing</p>
        <div className="flex flex-col gap-3">
          {[...positions.map((player) => ({ ...player }))]
            .sort((a, b) => {
              if (a.label === b.label) {
                return Number(a.id) - Number(b.id); // tie-breaker
              }
              return b.label - a.label; // highest first
            })
            .map((player) => {
              return (
                <div
                  key={player.id}
                  className="bg-zinc-100 flex items-center p-2 gap-3 rounded-md"
                >
                  <div
                    className={cn(
                      "w-6 aspect-square rounded-full z-50 border-3 shadow-[4px_4px_0_rgba(1,1,1,0.2)]",
                      player.className,
                    )}
                  />
                  <p className="text-xl font-medium">Player {player.id}</p>
                </div>
              );
            })}
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
    <div className="bg-zinc-100 p-2 py-8 border rounded-lg flex gap-4 max-w-4xl mx-3 md:mx-auto">
      <div className="flex flex-col justify-between items-center w-full">
        <h2 className="scroll-m-20 mb-8 text-3xl font-semibold tracking-tight first:mt-0">
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
