import { Link, Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import { useUser } from "./store/user";
import axios from "./api/axios";
import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { useSocketStore } from "./store/socket";
import { useIsMobile } from "./hooks/use-mobile";
import { Toaster } from "sonner";

function App() {
  const isMobile = useIsMobile();
  const { user, login, logout } = useUser();
  const { connect, disconnect } = useSocketStore();
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await axios.get("/auth/me").then((res) => res.data);

      if (!data) return;

      if (data.loggedIn) {
        console.log("👤 Login Successfull", data.user);
        login(data.user);
      } else {
        logout();
      }
    };

    fetchUserData().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user.isLoggedIn && socket) {
      connect(socket);
      return;
    }

    disconnect();
  }, [user.isLoggedIn, socket, connect, disconnect]);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {isMobile && (
          <div className="flex justify-between items-center">
            <Link
              to={"/"}
              className="title-font text-2xl flex items-baseline justify-center m-1 ml-3 gap-1 motion-preset-t"
            >
              <img src="/logo.png" alt="Snake and ladder" width={80} />
            </Link>
            <SidebarTrigger className="m-2 bg-zinc-100 h-full" />
          </div>
        )}
        <Outlet />
      </main>
      <Toaster richColors />
    </SidebarProvider>
  );
}

export default App;
