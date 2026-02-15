import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const RollDice = ({ className }: { className?: string }) => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const update = () => {
      setInterval(() => {
        setNumber((prev) => {
          return (prev + 1) % 6;
        });
      }, 200);
    };

    update();
  }, []);
  return (
    <div className={cn("aspect-square w-10 animate-roll-dice", className)}>
      <img
        src={`/dice_${number + 1}.png`}
        alt=""
        className="select-none"
        draggable={"false"}
      />
    </div>
  );
};
export default RollDice;
