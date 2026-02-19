import type { WebSocket } from "ws";
import { RED_ASCII } from "./contants.js";
import { ERROR, GAME_OVER } from "./messages.js";

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
  public socket: WebSocket | null;

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

  public removePlayer(playerId: string): string {
    const gameId = this.playerId_gameId.get(playerId);
    if (!gameId) return ERROR;

    this.playerId_gameId.delete(playerId);

    if (!this.gameId_players.has(gameId)) return ERROR;

    const players = this.gameId_players.get(gameId);

    players?.delete(playerId);

    if (players?.size === 0) {
      this.gameId_players.delete(gameId);

      console.log("SocketManager :: Deleting game because of zero players");

      return GAME_OVER;
    }

    return "ok";
  }

  public removeGame(gameId: string) {
    if (!this.gameId_players.has(gameId)) return;

    const players = this.gameId_players.get(gameId);

    this.gameId_players.delete(gameId);

    players?.forEach((player) => {
      this.playerId_gameId.delete(player.playerId);
    });
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
      if (player.socket && player.socket.readyState === player.socket.OPEN) {
        player.socket.send(JSON.stringify(message));
      }
    });

    // let playersEmails = Array.from(players.values())
    //   .map((p) => p.email)
    //   .join(", ");

    // console.log(`✉️  Message Broadcasted to ${playersEmails}`);
  }

  public sendMessageTo(playerId: string, message: Record<any, any>) {
    const gameId = this.playerId_gameId.get(playerId);

    if (!gameId) return;

    const player = this.gameId_players.get(gameId)?.get(playerId);

    if (!player || !player.socket) return;

    player.socket.send(JSON.stringify(message));
  }
}

export const socketManager = new SocketManager();
