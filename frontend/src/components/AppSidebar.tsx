import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useUser } from "@/store/user";
import {
  DoorOpen,
  FileCodeCorner,
  GlobeX,
  HousePlus,
  Key,
  Swords,
} from "lucide-react";
import { Link } from "react-router";

const AppSidebar = () => {
  const { user } = useUser();

  const verifyUser = (url: string) => {
    if (user.isLoggedIn) {
      return url;
    }
    return "/login";
  };
  return (
    <Sidebar>
      <SidebarHeader className="">
        <Link
          to={"/"}
          className="title-font text-2xl flex items-baseline justify-center gap-1 motion-preset-t"
        >
          <img src="/logo.png" alt="Snake and ladder" width={200} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Play</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={verifyUser("/game/random")} className="text-xl">
                    <Swords className="size-6!" />
                    Play with Random
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/game/offline" className="text-xl">
                    <GlobeX className="size-6!" />
                    Pass & Play
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Room</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={verifyUser("/game/join")} className="text-xl">
                  <DoorOpen className="size-6!" />
                  Join Room
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={verifyUser("/game/create")} className="text-xl">
                  <HousePlus className="size-6!" />
                  Create Room
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/documentation" className="text-xl">
                  <FileCodeCorner className="size-6!" />
                  Documentation
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {!user.isLoggedIn && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/login" className="text-xl">
                    <Key className="size-6!" />
                    Login
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex gap-3">
          <Link
            to="https://www.linkedin.com/in/tanujsharma911/"
            target="_blank"
          >
            <FaLinkedinIn
              size={25}
              className="opacity-60 hover:opacity-100 transition"
            />
          </Link>
          <Link to="https://github.com/tanujsharma911" target="_blank">
            <FaGithub
              size={23}
              className="opacity-60 hover:opacity-100 transition"
            />
          </Link>
          <Link to="https://x.com/tanujsharma911" target="_blank">
            <FaXTwitter
              size={23}
              className="opacity-60 hover:opacity-100 transition"
            />
          </Link>
        </div>
        {user.isLoggedIn && (
          <Link
            to="/profile"
            className="bg-zinc-100 p-2 border rounded-lg flex gap-2"
          >
            <div className="flex flex-col justify-center">
              <Avatar className="outline-1">
                <AvatarImage
                  src={user.avatar}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-md max-w-41 truncate whitespace-nowrap">
                {user.displayName}
              </p>
              <p className="text-xs max-w-41 truncate whitespace-nowrap">
                {user.email}
              </p>
            </div>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
