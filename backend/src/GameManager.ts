import { Socket } from "socket.io";
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

  public addPlayer(player: playerType, socket: Socket) {
    const playerExist = this.players.find(
      (ply) => ply.playerId === player._id.toString(),
    );

    if (playerExist) {
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
        playerId: player._id.toString(),
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
      return;
    }

    player.socket?.disconnect();
    player.socket = null;
  }

  public removeGame(game: Game) {
    this.activeGames = this.activeGames.filter((g) => g.gameId !== game.gameId);
    this.waitingGames = this.waitingGames.filter(
      (g) => g.gameId !== game.gameId,
    );

    socketManager.removeGame(game.gameId);
  }

  public async addHandler(player: Player) {
    if (!player.socket) return;

    player.socket.on("message", (msg) => {
      // Player want to join
      if (msg.type === JOIN) {
        const joinedGame = socketManager.getGameId(player.playerId);

        if (joinedGame) {
          console.log(`GameManager :: Already joined game`, joinedGame);
          return;
        }

        const similarGame = this.waitingGames.find(
          (game) => game.gameOf === msg.game_of && !game.gameStarted,
        );

        if (!similarGame) {
          const gameInstance = new Game(msg.game_of);

          gameInstance.addPlayer(player);

          this.waitingGames.push(gameInstance);

          console.log(`GameManager :: Created new game`, gameInstance.gameId);
        } else {
          similarGame.addPlayer(player);

          console.log(
            `GameManager :: Joined existing game`,
            similarGame.gameId,
          );

          if (similarGame.gameStarted) {
            this.waitingGames = this.waitingGames.filter(
              (game) => game.gameId !== similarGame.gameId,
            );

            this.activeGames.push(similarGame);

            console.log(
              `GameManager :: existing game started`,
              similarGame.gameId,
            );
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

        if (!gameId) {
          console.log(
            `GameManager :: No game or lobby found for player`,
            player.email,
          );
          socketManager.sendMessageTo(player.playerId, { type: GAME_OVER });
          return;
        }

        const game =
          this.waitingGames.find((g) => g.gameId === gameId) ||
          this.privateWaitingGames.find((g) => g.gameId === gameId) ||
          this.activeGames.find((g) => g.gameId === gameId);

        if (!game) {
          console.log(
            RED_ASCII,
            `GameManager :: gameId is present in sockectManager but no game found`,
            gameId,
          );
          return;
        }

        game.sendUpdateTo(player.playerId);
      }

      // Player want to leave lobby
      else if (msg.type === LEAVE_LOBBY) {
        const gameId = socketManager.getGameId(player.playerId);

        const game =
          this.waitingGames.find((g) => g.gameId === gameId) ||
          this.privateWaitingGames.find((g) => g.gameId === gameId);

        if (!game) {
          // Game maybe in Active game
          console.log(
            `GameManager :: Can't leave lobby, not in waiting or private waiting games`,
          );
          return;
        }

        const status = game.removePlayer(player.playerId);
        socketManager.sendMessageTo(player.playerId, { type: LEAVE_LOBBY });
        socketManager.removePlayer(player.playerId);

        if (status === GAME_OVER) {
          this.removeGame(game);
        }
      }

      // Player want to leave a active game
      else if (msg.type === LEAVE_GAME) {
        const gameId = socketManager.getGameId(player.playerId);

        if (!gameId) {
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

        console.log(`GameManager :: Player left gameId: ${game.gameId}`);
      }

      // Player wants to create a private game
      else if (msg.type === CREATE_ROOM) {
        const existingGameId = socketManager.getGameId(player.playerId);

        if (existingGameId) {
          console.log(
            `GameManager :: addHandler :: Player already in game, Can't create private game`,
            existingGameId,
          );
          return;
        }

        const privateGame = new Game(msg.gameOf);

        privateGame.addPlayer(player);

        this.privateWaitingGames.push(privateGame);
      }

      // Player wants to join a private game
      else if (msg.type === JOIN_ROOM) {
        const joinedExistingGameId = socketManager.getGameId(player.playerId);

        if (joinedExistingGameId) {
          console.log(
            `GameManager :: Already joined game`,
            joinedExistingGameId,
          );
          return;
        }

        const privateGame = this.privateWaitingGames.find(
          (g) => g.gameId === msg.gameId,
        );

        if (!privateGame) {
          console.log(
            `GameManager :: No private game found for gameId`,
            msg.gameId,
          );
          return;
        }

        socketManager.addPlayer(player, privateGame.gameId);
        privateGame.addPlayer(player);

        console.log(`GameManager :: Joined private game`, privateGame.gameId);

        if (privateGame.gameStarted) {
          this.privateWaitingGames = this.privateWaitingGames.filter(
            (g) => g.gameId !== privateGame.gameId,
          );

          this.activeGames.push(privateGame);

          console.log(
            `GameManager :: Private game started`,
            privateGame.gameId,
          );
        }
      }
    });
  }
}
