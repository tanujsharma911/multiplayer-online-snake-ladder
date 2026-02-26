import type { WebSocket } from "ws";
import Game from "./Game.js";
import { Player, socketManager } from "./SocketManager.js";
import {
  CREATE_ROOM,
  GAME_OVER,
  GET_GAME_UPDATE,
  JOIN,
  JOIN_ROOM,
  LEAVE_GAME,
  LEAVE_LOBBY,
  MOVE,
} from "./messages.js";
import { RED_ASCII } from "./contants.js";

type playerType = {
  _id: string;
  displayName: string;
  avatar: string | null | undefined;
  email: string;
};

export class GameManager {
  public activeGames: Game[];
  public waitingGames: Game[];
  public privateWaitingGames: Game[];
  public players: Player[];

  constructor() {
    this.activeGames = [];
    this.waitingGames = [];
    this.privateWaitingGames = [];
    this.players = [];
  }

  public addPlayer(player: playerType, socket: WebSocket) {
    const playerExist = this.players.find((ply) => ply.playerId === player._id);

    if (playerExist) {
      // Reconnect Logic

      playerExist.socket = socket;

      const gameId = socketManager.getGameId(playerExist.playerId);

      if (!gameId) {
        this.addHandler(playerExist);
        return;
      }

      const game =
        this.waitingGames.find((g) => g.gameId === gameId) ||
        this.activeGames.find((g) => g.gameId === gameId) ||
        this.privateWaitingGames.find((g) => g.gameId === gameId);

      if (game) {
        game.sendUpdate();
      }

      this.addHandler(playerExist);
    } else {
      // New player
      const playerInstance = new Player({
        displayName: player.displayName,
        playerId: player._id,
        avatar: player.avatar,
        socket: socket,
        email: player.email,
      });

      this.players.push(playerInstance);
      this.addHandler(playerInstance);
    }
  }

  public disconnectPlayer(playerId: string) {
    const player = this.players.find((ply) => ply.playerId === playerId);

    if (!player) {
      console.log(RED_ASCII, "GameManager :: Unknoun player disconnects");
      return;
    }

    player.socket?.close();
    player.socket = null;
  }

  public removeGame(game: Game) {
    this.activeGames = this.activeGames.filter((g) => g.gameId !== game.gameId);
    this.waitingGames = this.waitingGames.filter(
      (g) => g.gameId !== game.gameId,
    );

    socketManager.removeGame(game.gameId);

    console.log("👉 ", game.gameId, "Removed");
  }

  public async addHandler(player: Player) {
    if (!player.socket) return;

    player.socket.on("message", (payload) => {
      const msg = JSON.parse(payload.toString());

      // Player want to join
      if (msg.type === JOIN) {
        console.log("👉 ", player.email, "want to join game of", msg.game_of);

        const joinedGame = socketManager.getGameId(player.playerId);

        if (joinedGame) {
          console.log(RED_ASCII, "GameManager :: PLayer is already in game");
          return;
        }

        const similarGame = this.waitingGames.find(
          (game) => game.gameOf === msg.game_of && !game.gameStarted,
        );

        if (!similarGame) {
          const gameInstance = new Game(msg.game_of);

          console.log("👉 Created new game :: gameId", gameInstance.gameId);

          socketManager.addPlayer(player, gameInstance.gameId);
          gameInstance.addPlayer(player);

          this.waitingGames.push(gameInstance);
        } else {
          socketManager.addPlayer(player, similarGame.gameId);
          console.log(
            "👉 Added to existing game :: gameId",
            similarGame.gameId,
          );

          similarGame.addPlayer(player);

          if (similarGame.gameStarted) {
            this.waitingGames = this.waitingGames.filter(
              (game) => game.gameId !== similarGame.gameId,
            );

            this.activeGames.push(similarGame);

            console.log("👉 Game started :: gameId", similarGame.gameId);
          }
        }
      }

      // Player want to move
      else if (msg.type === MOVE) {
        const gameId = socketManager.getGameId(player.playerId);
        if (!gameId) return;

        const game = this.activeGames.find((g) => g.gameId === gameId);

        if (!game) {
          // Game may be in waiting list
          return;
        }

        game.move(player.playerId).then((status) => {
          if (status === GAME_OVER) {
            this.removeGame(game);
          }
        });
      }

      // Player wants latest game updates
      else if (msg.type === GET_GAME_UPDATE) {
        if (!player.socket) return;

        const gameId = socketManager.getGameId(player.playerId);

        const game =
          this.waitingGames.find((g) => g.gameId === gameId) ||
          this.activeGames.find((g) => g.gameId === gameId);

        if (game) {
          game.sendUpdateTo(player.playerId);
        }
      }

      // Player want to leave lobby
      else if (msg.type === LEAVE_LOBBY) {
        const gameId = socketManager.getGameId(player.playerId);

        const game =
          this.waitingGames.find((g) => g.gameId === gameId) ||
          this.privateWaitingGames.find((g) => g.gameId === gameId);

        if (!game) {
          // Game maybe in Active game
          return;
        }

        const status = game.removePlayer(player.playerId);
        socketManager.sendMessageTo(player.playerId, { type: LEAVE_LOBBY });
        socketManager.removePlayer(player.playerId);

        if (status === GAME_OVER) {
          this.removeGame(game);
          console.log(`GameManager :: Game ${game.gameId} ended`);
        }

        console.log(`👉 ${player.email} left lobby gameId: ${game.gameId}`);
      }

      // Player want to leave a active game
      else if (msg.type === LEAVE_GAME) {
        const gameId = socketManager.getGameId(player.playerId);

        if (!gameId) {
          console.log(
            RED_ASCII,
            "GameManager :: Player want to leave a game but that does not exist",
          );
          return;
        }

        const game = this.activeGames.find((g) => g.gameId === gameId);

        if (!game) {
          console.log(
            RED_ASCII,
            "GameManager :: Player want to leave a game but not in a game",
          );
          return;
        }

        socketManager.sendMessageTo(player.playerId, { type: LEAVE_GAME });
        const status = game.removePlayer(player.playerId);
        socketManager.removePlayer(player.playerId);

        if (status === GAME_OVER) {
          this.removeGame(game);
          console.log(`GameManager :: Game ${game.gameId} ended`);
        }

        console.log(`👉 ${player.email} left gameId: ${game.gameId}`);
      }

      // Player wants to create a private game
      else if (msg.type === CREATE_ROOM) {
        const existingGameId = socketManager.getGameId(player.playerId);

        if (existingGameId) {
          console.log(
            RED_ASCII,
            "GameManager :: Player want to create private game but already in a game",
          );
          return;
        }

        const privateGame = new Game(msg.gameOf);

        this.privateWaitingGames.push(privateGame);

        socketManager.addPlayer(player, privateGame.gameId);
        privateGame.addPlayer(player);

        console.log(`👉 ${player.email} created gameId: ${privateGame.gameId}`);
      }

      // Player wants to join a private game
      else if (msg.type === JOIN_ROOM) {
        const joinedExistingGameId = socketManager.getGameId(player.playerId);

        if (joinedExistingGameId) {
          console.log(
            RED_ASCII,
            "GameManager :: Player want to join private game but is already in a game",
          );
          return;
        }

        const privateGame = this.privateWaitingGames.find(
          (g) => g.gameId === msg.gameId,
        );

        if (!privateGame) {
          console.log(
            RED_ASCII,
            "GameManager :: Private game not found",
            msg.gameId,
          );
          return;
        }

        socketManager.addPlayer(player, privateGame.gameId);
        privateGame.addPlayer(player);

        if (privateGame.gameStarted) {
          this.privateWaitingGames = this.privateWaitingGames.filter(
            (g) => g.gameId !== privateGame.gameId,
          );

          this.activeGames.push(privateGame);
        }
      }
    });
  }
}
