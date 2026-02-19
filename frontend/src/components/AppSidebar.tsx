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
import { useUser } from "@/store/user";
import { GlobeX, Key, Swords } from "lucide-react";
import { Link } from "react-router";

const AppSidebar = () => {
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader className="">
        <Link
          to={"/"}
          className="title-font text-2xl flex items-baseline justify-center gap-1 motion-preset-t"
        >
          Snake & Ladder
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/game/random" className="text-xl">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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
              <p className="text-md">{user.displayName}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
