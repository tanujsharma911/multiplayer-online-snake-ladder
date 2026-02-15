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
import Game from "./pages/Game.tsx";

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
        element: <Profile />,
      },
      {
        path: "/game/offline",
        element: <GameOffline />,
      },
      {
        path: "/game/random",
        element: <Game />,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
      {
        path: "/:other",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
