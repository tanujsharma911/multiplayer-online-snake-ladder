import { cn } from "@/lib/utils";

const Dice = ({
  number,
  onClick,
  playerIndex,
  turnIndex,
}: {
  number?: number;
  onClick?: () => void;
  playerIndex?: number | undefined;
  turnIndex?: number;
}) => {
  return (
    <button
      className={cn("aspect-square w-10 bg-transparent border-none")}
      onClick={onClick}
      disabled={playerIndex !== undefined ? playerIndex !== turnIndex : false}
    >
      <img
        src={`/dice_${number}.png`}
        alt=""
        className="select-none"
        draggable={"false"}
      />
    </button>
  );
};
export default Dice;
