import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import Home from "./pages/Home.tsx";
import GameOffline from "./pages/GameOffline.tsx";
import NotFound from "./pages/NotFound.tsx";
import Room from "./pages/Room.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import Lobby from "./pages/Lobby.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import CustomLobby from "./pages/CustomLobby.tsx";
import Documentation from "./pages/Documentation.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/game/offline",
        element: <GameOffline />,
      },
      {
        path: "/game/join",
        element: (
          <AuthLayout>
            <CustomLobby join />
          </AuthLayout>
        ),
      },
      {
        path: "/game/create",
        element: (
          <AuthLayout>
            <CustomLobby create />
          </AuthLayout>
        ),
      },
      {
        path: "/game/random",
        element: (
          <AuthLayout>
            <Lobby />
          </AuthLayout>
        ),
      },
      {
        path: "/room/:roomId",
        element: (
          <AuthLayout>
            <Room />
          </AuthLayout>
        ),
      },
      {
        path: "/documentation",
        element: <Documentation />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
