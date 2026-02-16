import type { WebSocket } from "ws";
import { RED_ASCII } from "./contants.js";

interface PlayerType {
  playerId: string;
  displayName: string;
  email: string;
  avatar: string | undefined | null;
  socket: WebSocket;
}

export class Player {
  public playerId: string;
  public displayName: string;
  public email: string;
  public avatar: string | undefined | null;
  public socket: WebSocket;

  constructor({ playerId, displayName, email, avatar, socket }: PlayerType) {
    this.playerId = playerId;
    this.displayName = displayName;
    this.email = email;
    this.avatar = avatar;
    this.socket = socket;
  }
}

class SocketManager {
  public playerId_gameId: Map<string, string>;
  public gameId_players: Map<string, Map<string, Player>>;

  constructor() {
    this.playerId_gameId = new Map<string, string>();
    this.gameId_players = new Map<string, Map<string, Player>>();
  }

  public getGameId(playerId: string) {
    return this.playerId_gameId.get(playerId);
  }

  public addPlayer(player: Player, gameId: string): void {
    this.playerId_gameId.set(player.playerId, gameId);

    if (!this.gameId_players.has(gameId)) {
      this.gameId_players.set(gameId, new Map<string, Player>());
    }

    const players = this.gameId_players.get(gameId);

    players!.set(player.playerId, player);
  }

  public removePlayer(playerId: string): void {
    const gameId = this.playerId_gameId.get(playerId);
    if (!gameId) return;

    this.playerId_gameId.delete(playerId);

    if (!this.gameId_players.has(gameId)) return;

    const players = this.gameId_players.get(gameId);

    players?.delete(playerId);

    if (players?.size === 0) {
      this.gameId_players.delete(gameId);
      console.log("SocketManager :: Deleting game because of zero players");
    }
  }

  public removeGame(gameId: string) {
    // TODO
  }

  public broadcast(gameId: string, message: Record<any, any>) {
    if (!this.gameId_players.has(gameId)) {
      console.log(RED_ASCII, "SocketManager :: GameId not exist", gameId);
      return;
    }

    const players = this.gameId_players.get(gameId);

    if (!players) {
      console.log(RED_ASCII, "SocketManager :: Game exists without players");
      return;
    }

    players.forEach((player, playerId) => {
      player.socket.send(JSON.stringify(message));
    });

    let playersNames = "";

    [...players.values()].forEach((playerInstance, i) => {
      playersNames += playerInstance.email;

      if (i < [...players.values()].length - 1) playersNames += ", ";
    });

    console.log(`✉️  Message Broadcasted to ${playersNames}`);
  }
}

export const socketManager = new SocketManager();
