import type { WebSocket } from "ws";
import type Game from "./Game.js";
import type { Player } from "./SocketManager.js";

export class GameManager {
  public games: Game[];
  public waitingPlayers: string[];
  public players: Player[];

  constructor() {
    this.games = [];
    this.waitingPlayers = [];
    this.players = [];
  }

  public addPlayer(
    player: {
      _id: string;
      displayName: string;
      avatar: string | null | undefined;
      email: string;
    },
    socket: WebSocket,
  ) {
    // addHandler
  }
  
  public removePlayer(playerId: string) {
    // Remove user
  }
  
  private addHandler(user: Player) {
    // Listen to messages here
  }
}
