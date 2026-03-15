import { File, Folder, Tree } from "@/components/ui/file-tree";
import { FaReact, FaNodeJs, FaDocker } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  SiExpress,
  SiSocketdotio,
  SiMongodb,
  SiHostinger,
  SiPassport,
  SiNginx,
  SiShadcnui,
} from "react-icons/si";
import { CodeXml } from "lucide-react";
import { Link } from "react-router";

const ELEMENTS = [
  {
    id: "1",
    isSelectable: true,
    name: "backend",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "src",
        children: [
          { id: "3", isSelectable: true, name: "Game.ts" },
          { id: "4", isSelectable: true, name: "GameManager.ts" },
          { id: "5", isSelectable: true, name: "SocketManager.ts" },
          { id: "6", isSelectable: true, name: "app.ts" },
          { id: "7", isSelectable: true, name: "contants.ts" },
          { id: "8", isSelectable: true, name: "index.ts" },
          { id: "9", isSelectable: true, name: "messages.ts" },
          { id: "10", isSelectable: true, name: "passport.ts" },
          { id: "11", isSelectable: true, name: "types.ts" },
          { id: "12", isSelectable: true, name: "utils.ts" },
          {
            id: "13",
            isSelectable: true,
            name: "db",
            children: [{ id: "14", isSelectable: true, name: "index.ts" }],
          },
          {
            id: "15",
            isSelectable: true,
            name: "middleware",
            children: [
              { id: "16", isSelectable: true, name: "session.middleware.ts" },
              {
                id: "17",
                isSelectable: true,
                name: "verifyAuth.middleware.ts",
              },
            ],
          },
          {
            id: "18",
            isSelectable: true,
            name: "models",
            children: [{ id: "19", isSelectable: true, name: "user.model.ts" }],
          },
          {
            id: "20",
            isSelectable: true,
            name: "routes",
            children: [{ id: "21", isSelectable: true, name: "auth.route.ts" }],
          },
        ],
      },
      { id: "22", isSelectable: true, name: "Dockerfile" },
      { id: "23", isSelectable: true, name: "package.json" },
    ],
  },
  {
    id: "26",
    isSelectable: true,
    name: "frontend",
    children: [
      {
        id: "27",
        isSelectable: true,
        name: "src",
        children: [
          { id: "28", isSelectable: true, name: "App.tsx" },
          { id: "29", isSelectable: true, name: "main.tsx" },
          { id: "30", isSelectable: true, name: "index.css" },
          {
            id: "31",
            isSelectable: true,
            name: "api",
            children: [{ id: "32", isSelectable: true, name: "axios.ts" }],
          },
          {
            id: "33",
            isSelectable: true,
            name: "components",
            children: [
              { id: "34", isSelectable: true, name: "AppSidebar.tsx" },
              { id: "35", isSelectable: true, name: "AuthLayout.tsx" },
              { id: "36", isSelectable: true, name: "Board.tsx" },
              {
                id: "37",
                isSelectable: true,
                name: "ui",
                children: [
                  { id: "38", isSelectable: true, name: "Dice.tsx" },
                  { id: "39", isSelectable: true, name: "RollDice.tsx" },
                  { id: "40", isSelectable: true, name: "accordion.tsx" },
                  { id: "41", isSelectable: true, name: "alert-dialog.tsx" },
                  { id: "42", isSelectable: true, name: "avatar.tsx" },
                  { id: "43", isSelectable: true, name: "button.tsx" },
                  { id: "44", isSelectable: true, name: "dialog.tsx" },
                  { id: "45", isSelectable: true, name: "file-tree.tsx" },
                  { id: "46", isSelectable: true, name: "input.tsx" },
                  { id: "47", isSelectable: true, name: "scroll-area.tsx" },
                  { id: "48", isSelectable: true, name: "separator.tsx" },
                  { id: "49", isSelectable: true, name: "sheet.tsx" },
                  { id: "50", isSelectable: true, name: "sidebar.tsx" },
                  { id: "51", isSelectable: true, name: "skeleton.tsx" },
                  { id: "52", isSelectable: true, name: "tooltip.tsx" },
                ],
              },
            ],
          },
          {
            id: "53",
            isSelectable: true,
            name: "hooks",
            children: [
              { id: "54", isSelectable: true, name: "use-mobile.ts" },
              { id: "55", isSelectable: true, name: "useSocket.tsx" },
            ],
          },
          {
            id: "56",
            isSelectable: true,
            name: "lib",
            children: [
              { id: "57", isSelectable: true, name: "constants.ts" },
              { id: "58", isSelectable: true, name: "messages.ts" },
              { id: "59", isSelectable: true, name: "utils.ts" },
            ],
          },
          {
            id: "60",
            isSelectable: true,
            name: "pages",
            children: [
              { id: "61", isSelectable: true, name: "CustomLobby.tsx" },
              { id: "62", isSelectable: true, name: "Documentation.tsx" },
              { id: "63", isSelectable: true, name: "GameOffline.tsx" },
              { id: "64", isSelectable: true, name: "Home.tsx" },
              { id: "65", isSelectable: true, name: "Lobby.tsx" },
              { id: "66", isSelectable: true, name: "Login.tsx" },
              { id: "67", isSelectable: true, name: "NotFound.tsx" },
              { id: "68", isSelectable: true, name: "Profile.tsx" },
              { id: "69", isSelectable: true, name: "Room.tsx" },
            ],
          },
          {
            id: "70",
            isSelectable: true,
            name: "store",
            children: [
              { id: "71", isSelectable: true, name: "socket.ts" },
              { id: "72", isSelectable: true, name: "user.ts" },
            ],
          },
        ],
      },
      { id: "73", isSelectable: true, name: "Dockerfile" },
      { id: "74", isSelectable: true, name: "package.json" },
    ],
  },
];

const Doc = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-16">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-600">
            Feb 15 — Mar 15, 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Project Documentation
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
            A real-time multiplayer snakes and ladders web-based game. Built on
            a client-server architecture where the server maintains the
            authoritative game state to ensure fair play and synchronization
            across all clients.
          </p>
        </header>

        {/* Overview */}
        <div className="space-y-5">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Overview
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
            A real-time multiplayer snakes and ladders web based game and
            client-server architecture where the server maintains the
            authoritative game state to ensure fair play & synchronization
            across all clients.
          </p>
        </div>

        {/* TechStack */}
        <section className="space-y-5">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Tech Stack Layer
          </h2>
          <div>
            <div className="my-6 ml-6 flex flex-col gap-4">
              {/* Frontend */}
              <div>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  Frontend
                </p>
                <div className="flex flex-wrap mt-1">
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <FaReact size={22} className="text-sky-600" />
                    React.JS
                  </div>
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <RiTailwindCssFill size={22} className="text-sky-500" />
                    Tailwind CSS
                  </div>
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiShadcnui size={15} className="text-zinc-700" />
                    Shad CN
                  </div>
                </div>
              </div>

              {/* Backend */}
              <div>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  Backend
                </p>
                <div className="flex flex-wrap mt-1">
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <FaNodeJs size={22} className="text-green-600" />
                    Node JS
                  </div>
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiExpress
                      size={22}
                      className="text-gray-800 dark:text-gray-200"
                    />
                    Express
                  </div>
                </div>
              </div>

              {/* Realtime Engine */}
              <div>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  Realtime Engine
                </p>
                <div className="flex flex-wrap mt-1">
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiSocketdotio
                      size={22}
                      className="text-zinc-900 dark:text-zinc-100"
                    />
                    Socket.io
                  </div>
                </div>
              </div>

              {/* Database */}
              <div>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  Database
                </p>
                <div className="flex flex-wrap mt-1">
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiMongodb size={22} className="text-green-500" />
                    Mongo DB (Mongoose ODM)
                  </div>
                </div>
              </div>

              {/* Authentication */}
              <div>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  Authentication
                </p>
                <div className="flex flex-wrap mt-1">
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiPassport size={22} className="text-lime-600" />
                    Passport.js (Google OAuth 2.0)
                  </div>
                </div>
              </div>

              {/* Deployment */}
              <div>
                <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  Deployment
                </p>
                <div className="flex flex-wrap mt-1">
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <FaDocker size={20} className="text-sky-600" />
                    Docker
                  </div>
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiHostinger size={20} className="text-purple-600" />
                    Hostinger VPS
                  </div>
                  <div className="flex items-center gap-2 ml-1 bg-zinc-50 border py-1 px-2 rounded-2xl w-fit">
                    <SiNginx size={20} className="text-green-600" />
                    Nginx (Reverse Proxy)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <div className="space-y-5">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            System Architecture
          </h2>
          {/* Server-Authoritative Logic */}
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            1. Server-Authoritative Logic
          </h4>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
            To prevent client-side manipulation, the{" "}
            <strong>Server is the "Source of Truth."</strong>
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <strong>Authentication</strong>: Check user is authenticated or
              not before allowing them to join a game room. Implemented using
              Passport.js with Google OAuth 2.0 strategy.
            </li>
            <li>
              <strong>Match Making</strong>: The server manages public and
              private rooms and player matchmaking to ensure balanced and fair
              games. Players are assigned to rooms based on availability.
            </li>
            <li>
              <strong>Dice Rolls</strong>: Generated on the server using
              <code className="mx-1 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium">
                Math.random()
              </code>
              .
            </li>
            <li>
              <strong>Position Validation</strong>: The server calculates the
              new position, checks for snakes/ladders, and validates the win
              condition before broadcasting to clients.
            </li>
            <li>
              <strong>Turn Management</strong>: A server-side timer/state
              machine manages player turns to prevent out-of-order moves.
            </li>
          </ul>
          <div className="w-full bg-zinc-100 p-2 rounded-lg">
            <img
              src="/uml.png"
              alt="Documentation"
              className="w-full h-auto select-none"
              draggable={false}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            UML class diagram
          </p>
          {/* 2. Socket.io */}
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            2. Socket.io Communication Flow
          </h4>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
            The game uses a <strong>Room-based Architecture</strong> to isolate
            game data
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                JOIN_ROOM
              </code>
              : Users join a private room with game ID.
            </li>
            <li>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                MOVE
              </code>
              : Client sends a request → Server calculates → Server broadcasts
              move-player to all clients in the room.
            </li>
            <li>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                LEAVE_GAME
              </code>
              : Client sends a request → Server remove player from game and
              socket manager class → Server broadcasts new playing players list
              to all clients in the room.
            </li>
          </ul>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
            And many more events for lobby updates, game state synchronization,
            and error handling.
          </p>
          {/* 2. Database */}
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            3. Database Schema
          </h4>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <strong>User Collection</strong>: Stores Google Profile ID,
              Display Name, and Avatar.
            </li>
            <li>
              <strong>Session Store</strong>: Users sessions are stored in
              memory, which is suitable for now but i will replace with Redis in
              future for better performance and scalability.
            </li>
          </ul>
        </div>

        <div className="space-y-5">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Deployment & Reliability
          </h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <strong>Docker Container</strong>: Using Docker to ensure the
              Node.js server automatically restarts on failure.
            </li>
            <li>
              <strong>Reverse Proxy</strong>: Nginx handles SSL termination and
              forwards WebSocket traffic to the Express backend.
            </li>
            <li>
              <strong>State Persistence</strong>: MongoDB ensures that even if a
              server restarts, user profiles and historical data remain intact.
            </li>
          </ul>
          <div className="w-full bg-zinc-100 overflow-hidden rounded-lg">
            <img
              src="/architecture.png"
              alt="Architecture Diagram"
              className="w-full h-auto select-none"
              draggable={false}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Architecture diagram showing Docker, Nginx, and MongoDB integration
          </p>
        </div>

        {/* File Structure */}
        <div className="space-y-5">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            5. File Structure
          </h3>
          <Tree
            className="bg-zinc-100 overflow-hidden rounded-md p-2 relative"
            initialSelectedId="7"
            initialExpandedItems={["1", "2", "11", "26", "27"]}
            elements={ELEMENTS}
          >
            <Link
              className="absolute top-0 right-0 z-10 text-xs py-1.5 px-2.5 border bg-zinc-50 flex items-center gap-2 font-bold rounded-md"
              to="https://github.com/tanujsharma911/multiplayer-online-snake-ladder"
              target="_blank"
            >
              <CodeXml size={20} />
              View on GitHub
            </Link>
            <Folder element="backend" value="1">
              <Folder element="src" value="2">
                <Folder element="db" value="13">
                  <File value="14">
                    <p>index.ts</p>
                  </File>
                </Folder>

                <Folder element="middleware" value="15">
                  <File value="16">
                    <p>session.middleware.ts</p>
                  </File>
                  <File value="17">
                    <p>verifyAuth.middleware.ts</p>
                  </File>
                </Folder>

                <Folder element="models" value="18">
                  <File value="19">
                    <p>user.model.ts</p>
                  </File>
                </Folder>

                <Folder element="routes" value="20">
                  <File value="21">
                    <p>auth.route.ts</p>
                  </File>
                </Folder>

                <File value="3">
                  <p className="font-bold">Game.ts</p>
                </File>
                <File value="4">
                  <p className="font-bold">GameManager.ts</p>
                </File>
                <File value="5">
                  <p className="font-bold">SocketManager.ts</p>
                </File>
                <File value="8">
                  <p className="font-bold">index.ts</p>
                </File>
                <File value="6">
                  <p className="font-bold">app.ts</p>
                </File>
                <File value="10">
                  <p>passport.ts</p>
                </File>
                <File value="11">
                  <p className="opacity-60">types.ts</p>
                </File>
                <File value="12">
                  <p className="opacity-60">utils.ts</p>
                </File>
                <File value="7">
                  <p className="opacity-60">contants.ts</p>
                </File>
                <File value="9">
                  <p className="opacity-60">messages.ts</p>
                </File>
              </Folder>

              <File value="22">
                <p className="opacity-60">Dockerfile</p>
              </File>
              <File value="23">
                <p className="opacity-60">package.json</p>
              </File>
            </Folder>

            <Folder element="frontend" value="26">
              <Folder element="src" value="27">
                <Folder element="api" value="31">
                  <File value="32">
                    <p>axios.ts</p>
                  </File>
                </Folder>

                <Folder element="components" value="33">
                  <File value="34">
                    <p>AppSidebar.tsx</p>
                  </File>
                  <File value="35">
                    <p>AuthLayout.tsx</p>
                  </File>
                  <File value="36">
                    <p>Board.tsx</p>
                  </File>

                  <Folder element="ui" value="37">
                    <File value="38">
                      <p>Dice.tsx</p>
                    </File>
                    <File value="39">
                      <p>RollDice.tsx</p>
                    </File>
                    <File value="40">
                      <p>accordion.tsx</p>
                    </File>
                    <File value="41">
                      <p>alert-dialog.tsx</p>
                    </File>
                    <File value="42">
                      <p>avatar.tsx</p>
                    </File>
                    <File value="43">
                      <p>button.tsx</p>
                    </File>
                    <File value="44">
                      <p>dialog.tsx</p>
                    </File>
                    <File value="45">
                      <p>file-tree.tsx</p>
                    </File>
                    <File value="46">
                      <p>input.tsx</p>
                    </File>
                    <File value="47">
                      <p>scroll-area.tsx</p>
                    </File>
                    <File value="48">
                      <p>separator.tsx</p>
                    </File>
                    <File value="49">
                      <p>sheet.tsx</p>
                    </File>
                    <File value="50">
                      <p>sidebar.tsx</p>
                    </File>
                    <File value="51">
                      <p>skeleton.tsx</p>
                    </File>
                    <File value="52">
                      <p>tooltip.tsx</p>
                    </File>
                  </Folder>
                </Folder>

                <Folder element="hooks" value="53">
                  <File value="54">
                    <p>use-mobile.ts</p>
                  </File>
                  <File value="55">
                    <p>useSocket.tsx</p>
                  </File>
                </Folder>

                <Folder element="lib" value="56">
                  <File value="57">
                    <p>constants.ts</p>
                  </File>
                  <File value="58">
                    <p>messages.ts</p>
                  </File>
                  <File value="59">
                    <p>utils.ts</p>
                  </File>
                </Folder>

                <Folder element="pages" value="60">
                  <File value="61">
                    <p>CustomLobby.tsx</p>
                  </File>
                  <File value="62">
                    <p>Documentation.tsx</p>
                  </File>
                  <File value="63">
                    <p>GameOffline.tsx</p>
                  </File>
                  <File value="64">
                    <p>Home.tsx</p>
                  </File>
                  <File value="65">
                    <p>Lobby.tsx</p>
                  </File>
                  <File value="66">
                    <p>Login.tsx</p>
                  </File>
                  <File value="67">
                    <p>NotFound.tsx</p>
                  </File>
                  <File value="68">
                    <p>Profile.tsx</p>
                  </File>
                  <File value="69">
                    <p>Room.tsx</p>
                  </File>
                </Folder>

                <Folder element="store" value="70">
                  <File value="71">
                    <p>socket.ts</p>
                  </File>
                  <File value="72">
                    <p>user.ts</p>
                  </File>
                </Folder>

                <File value="28">
                  <p className="font-bold">App.tsx</p>
                </File>
                <File value="29">
                  <p>main.tsx</p>
                </File>
                <File value="30">
                  <p className="opacity-60">index.css</p>
                </File>
              </Folder>

              <File value="73">
                <p className="opacity-60">Dockerfile</p>
              </File>
              <File value="74">
                <p className="opacity-60">package.json</p>
              </File>
            </Folder>
          </Tree>
        </div>
        <Link
          to="/"
          className="underline underline-offset-2 flex gap-2 items-center w-fit"
        >
          <FaArrowLeftLong />
          Go To Home Page
        </Link>
      </div>
    </div>
  );
};

export default Doc;
