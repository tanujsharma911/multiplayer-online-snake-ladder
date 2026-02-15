import { cn } from "@/lib/utils";

const Dice = ({
  number,
  onClick,
}: {
  number?: number;
  onClick?: () => void;
}) => {
  return (
    <button
      className={cn("aspect-square w-10 bg-transparent border-none")}
      onClick={onClick}
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
