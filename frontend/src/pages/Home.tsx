import { cn } from "@/lib/utils";
import { useUser } from "@/store/user";
import { Info } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = (url: string) => {
    if (user.isLoggedIn) {
      navigate(url);
    } else {
      navigate("/login");
      toast.error("Please login to play online");
    }
  };

  return (
    <div className="flex max-w-140 mx-6 mt-10 md:mx-auto flex-col items-center gap-4">
      {/* PLAY ONLINE */}
      <button
        className={cn("w-full h-40 relative group")}
        onClick={() => handleClick("/game/random")}
      >
        <div
          className={cn(
            "absolute w-full h-full -skew-x-6 border-3 border-black transition group-hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)]",
            user.isLoggedIn ? "bg-sky-700" : "bg-zinc-500",
          )}
        ></div>
        <div
          className={cn(
            "absolute w-20 h-full -skew-x-6 border-3 border-black",
            user.isLoggedIn ? "bg-sky-500" : "bg-zinc-200",
          )}
        ></div>
        <div className="absolute flex items-center inset-0 pl-3">
          <img
            src="/play_online.png"
            alt=""
            className={cn("w-20 md:w-25", !user.isLoggedIn && "grayscale")}
          />
        </div>

        <div className="relative z-10 p-10 pl-30">
          <h2 className="text-white text-left font-bold font-rubik text-4xl">
            Play Online
          </h2>
          <p
            className={cn(
              "font-bold font-rubik text-left text-xl",
              user.isLoggedIn ? "text-sky-200" : "text-zinc-200",
            )}
          >
            Play with random
          </p>
        </div>
      </button>

      {/* PLAY OFFLINE */}
      <button
        className="w-full h-40 relative group"
        onClick={() => navigate("/game/offline")}
      >
        <div className="absolute bg-green-700 w-full h-full -skew-x-6 border-3 border-black transition group-hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)]"></div>
        <div className="absolute bg-green-500 w-20 h-full -skew-x-6 border-3 border-black"></div>
        <div className="absolute flex items-center inset-0 pl-3">
          <img src="/pass_and_play.png" alt="" className={cn("w-20 md:w-25")} />
        </div>

        <div className="relative z-10 p-10 pl-30">
          <h2 className="text-white font-bold text-left font-rubik text-4xl">
            Play Offline
          </h2>
          <p className="text-green-200 font-bold text-left font-rubik text-xl">
            Pass and play
          </p>
        </div>
      </button>

      <div className="flex gap-4 w-full">
        {/* CREATE ROOM */}
        <button
          className="w-full h-30 relative group"
          onClick={() => handleClick("/game/create")}
        >
          <div
            className={cn(
              "absolute w-full h-full -skew-x-6 border-3 border-black transition group-hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)]",
              user.isLoggedIn ? "bg-orange-700" : "bg-zinc-500",
            )}
          ></div>
          <div
            className={cn(
              "absolute bg-orange-500 w-10 h-full -skew-x-6 border-3 border-black",
              user.isLoggedIn ? "bg-orange-500" : "bg-zinc-200",
            )}
          ></div>
          <div className="absolute flex items-center inset-0 pl-2 md:pl-3">
            <img
              src="/create_room.png"
              alt=""
              className={cn("w-16 md:w-20", !user.isLoggedIn && "grayscale")}
            />
          </div>

          <div className="relative z-10 p-7 pl-20 md:pl-25">
            <h2 className="text-white font-bold text-left font-rubik text-2xl">
              Create
            </h2>
            <p
              className={cn(
                "font-bold text-left font-rubik text-sm md:text-xl",
                user.isLoggedIn ? "text-orange-200" : "text-zinc-200",
              )}
            >
              Create a room
            </p>
          </div>
        </button>

        {/* JOIN ROOM */}
        <button
          className="w-full h-30 relative group"
          onClick={() => handleClick("/game/join")}
        >
          <div
            className={cn(
              "absolute w-full h-full -skew-x-6 border-3 border-black transition group-hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)]",
              user.isLoggedIn ? "bg-purple-700" : "bg-zinc-500",
            )}
          ></div>
          <div
            className={cn(
              "absolute bg-purple-500 w-10 h-full -skew-x-6 border-3 border-black",
              user.isLoggedIn ? "bg-purple-500" : "bg-zinc-200",
            )}
          ></div>
          <div className="absolute flex items-center inset-0 pl-2 md:pl-3">
            <img
              src="/join_room.png"
              alt=""
              className={cn("w-16 md:w-20", !user.isLoggedIn && "grayscale")}
            />
          </div>

          <div className="relative z-10 p-7 pl-20 md:pl-25 pr-0">
            <h2 className="text-white font-bold text-left font-rubik text-2xl">
              Join
            </h2>
            <p
              className={cn(
                "font-bold text-left font-rubik text-sm md:text-xl",
                user.isLoggedIn ? "text-purple-200" : "text-zinc-200",
              )}
            >
              Join a room
            </p>
          </div>
        </button>
      </div>
      {!user.isLoggedIn && (
        <p className="font-bold flex gap-2 opacity-60">
          <Info /> Login to play online
        </p>
      )}
      {/*<Button variant={"default"}>Button</Button>
      <Button variant={"outline"}>Button</Button>
      <Button variant={"destructive"}>Button</Button>
      <Button variant={"ghost"}>Button</Button>
      <Button variant={"secondary"}>Button</Button>*/}
    </div>
  );
};

export default Home;
