import { cn } from "@/lib/utils";
import { useUser } from "@/store/user";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CardProps {
  label: string;
  description: string;
  color: string;
  image: string;
  userLoggedIn: boolean;
  url: string;
  handleClick: (url: string) => void;
}

const Card = (props: CardProps) => {
  const { userLoggedIn, label, description, color, image, url, handleClick } =
    props;
  return (
    <button
      className={cn("h-30 md:h-40 w-full relative group")}
      onClick={() => handleClick(url)}
    >
      <div
        className={cn(
          "absolute w-full h-full -skew-x-6 border-3 border-black transition group-hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)]",
          userLoggedIn ? `bg-${color}-700` : "bg-zinc-500",
        )}
      ></div>
      <div
        className={cn(
          "absolute w-[15%] h-full -skew-x-6 border-3 border-black",
          userLoggedIn ? `bg-${color}-500` : "bg-zinc-200",
        )}
      ></div>
      <div className="absolute flex items-center inset-0 pl-3">
        <img
          src={`/${image}`}
          alt=""
          className={cn("w-18 md:w-25", !userLoggedIn && "grayscale")}
        />
      </div>

      <div className="relative z-10 h-full pl-25 md:pl-30 flex flex-col justify-center">
        <h2 className="text-white text-left font-bold font-rubik text-2xl md:text-4xl">
          {label}
        </h2>
        <p
          className={cn(
            "font-bold font-rubik text-left text-xl",
            userLoggedIn ? `text-${color}-200` : "text-zinc-200",
          )}
        >
          {description}
        </p>
      </div>
    </button>
  );
};

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
      <Card
        userLoggedIn={user.isLoggedIn}
        label="Play Online"
        description="Play with random"
        color="sky"
        image="play_online.png"
        url={"/game/online"}
        handleClick={handleClick}
      />

      {/* PLAY OFFLINE */}
      <Card
        userLoggedIn={true}
        label="Play Offline"
        description="Pass and play"
        color="green"
        image="pass_and_play.png"
        url={"/game/offline"}
        handleClick={navigate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card
          userLoggedIn={user.isLoggedIn}
          label="Create"
          description="Create a room"
          color="orange"
          image="create_room.png"
          url={"/game/create"}
          handleClick={handleClick}
        />
        <Card
          userLoggedIn={user.isLoggedIn}
          label="Join"
          description="Join a room"
          color="purple"
          image="join_room.png"
          url={"/game/join"}
          handleClick={handleClick}
        />
      </div>

      {/*<Button variant={"default"}>Button</Button>
      <Button variant={"outline"}>Button</Button>
      <Button variant={"destructive"}>Button</Button>
      <Button variant={"ghost"}>Button</Button>
      <Button variant={"secondary"}>Button</Button>*/}
    </div>
  );
};

export default Home;
