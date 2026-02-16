import type { WebSocket } from "ws";
import Game from "./Game.js";
import { Player, socketManager } from "./SocketManager.js";
import { GAME_OVER, JOIN, MOVE } from "./messages.js";
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
  public players: Player[];

  constructor() {
    this.activeGames = [];
    this.waitingGames = [];
    this.players = [];
  }

  public addPlayer(player: playerType, socket: WebSocket) {
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

  public removePlayer(playerId: string) {
    // remove player
  }

  public async addHandler(player: Player) {
    player.socket.on("message", (payload) => {
      const msg = JSON.parse(payload.toString());

      switch (msg.type) {
        case JOIN:
          console.log(
            "👉 ",
            player.displayName,
            "want to join game of",
            msg.game_of,
          );

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
            ``;

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

          break;
        case MOVE:
          const gameId = socketManager.getGameId(player.playerId);
          if (!gameId) return;

          const game = this.activeGames.find((g) => g.gameId === gameId);

          if (!game) {
            // Game may be in waiting list
            return;
          }

          game.move(player.playerId).then((status) => {
            console.log("👉 ", player.displayName, "moves");

            if (status === GAME_OVER) {
              this.activeGames = this.activeGames.filter(
                (g) => g.gameId !== game.gameId,
              );

              socketManager.broadcast(game.gameId, { type: GAME_OVER });

              socketManager.removeGame(game.gameId);

              console.log("👉 ", game.gameId, "Removed");
            }
          });

          break;
      }
    });
  }
}
