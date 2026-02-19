import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import { useUser } from "./store/user";
import axios from "./api/axios";
import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { useSocketStore } from "./store/socket";

function App() {
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
        <SidebarTrigger className="m-2" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default App;
