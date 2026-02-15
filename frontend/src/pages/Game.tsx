import { Button } from "@/components/ui/button";

const Game = () => {
  return (
    <div className="bg-zinc-100 p-2 py-8 border rounded-lg flex gap-4 max-w-4xl mx-3 md:mx-auto">
      <div className="flex flex-col justify-between items-center w-full">
        <h2 className="scroll-m-20 mb-8 text-3xl font-semibold tracking-tight first:mt-0">
          Select Number Of Players
        </h2>

        <div className="flex gap-3">
          <Button variant="outline">Two</Button>
          <Button variant="outline">Three</Button>
          <Button variant="outline">Four</Button>
        </div>
      </div>
    </div>
  );
};

export default Game;
