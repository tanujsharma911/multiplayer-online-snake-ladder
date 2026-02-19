import { cn, coordToLabel } from "@/lib/utils";
import { motion } from "motion/react";

interface BroadProps {
  className?: string;
  positions?: {
    x?: number;
    y?: number;
    label?: number;
    className?: string;
    color?: string;
    id?: string;
    playerId?: string;
  }[];
  boardData?: number[][];
}

const Board = (props: BroadProps) => {
  const { className, boardData, positions } = props;
  return (
    <div
      id="board"
      className={cn(
        "aspect-square relative border-2 border-zinc-900 grid grid-cols-10 grid-rows-10 select-none",
        className,
      )}
    >
      {boardData &&
        boardData.map((row, y) => {
          return row.map((_, x) => {
            const label = coordToLabel(x, y);
            const players = positions?.filter((player) => {
              return (
                (player.x === x && player.y === y) || player.label === label
              );
            });

            return (
              <div
                key={label.toString()}
                id={label.toString()}
                className={cn("relative", label % 2 == 0 && "bg-sky-300")}
              >
                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center ">
                  <p
                    className={cn(
                      "text-md font-bold text-center text-white",
                      label % 2 != 0 && "text-sky-300",
                    )}
                  >
                    {label}
                  </p>
                </div>

                {/* Piece */}
                <div
                  className={`absolute inset-0 gap-0.5 p-1 grid grid-cols-2`}
                >
                  {players &&
                    players?.length > 0 &&
                    players.map((player) => {
                      // console.log(
                      //   "Board :: playerId",
                      //   player.id || player.playerId,
                      // );
                      return (
                        <motion.div
                          key={player.id || player.playerId}
                          layoutId={`board-${player.id ?? player.playerId}`}
                          transition={{
                            type: "tween",
                            stiffness: 100,
                          }}
                          className={cn(
                            "w-full aspect-square rounded-full z-50 border-3 shadow-[4px_4px_0_rgba(1,1,1,0.2)]",
                            player.className
                              ? player.className
                              : `bg-${player.color}-400 border-${player.color}-800`,
                          )}
                        ></motion.div>
                      );
                    })}
                </div>
              </div>
            );
          });
        })}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/snake_and_ladders.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
};

export default Board;
