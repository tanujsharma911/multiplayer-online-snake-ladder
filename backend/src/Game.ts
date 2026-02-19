import { BOARD, RED_ASCII } from "./contants.js";
import {
  LOBBY_UPDATE,
  DICE_NUMBER,
  ERROR,
  GAME_OVER,
  MOVE,
  GAME_UPDATE,
  SET_TURN,
} from "./messages.js";
import { Player, socketManager } from "./SocketManager.js";
import { labelToCoord } from "./utils.js";
import type { WebSocket } from "ws";

const playersColors = ["red", "green", "yellow", "sky"];

class Game {
  public gameId: string;
  public players: (Player | null)[];
  public gameStarted: boolean;
  public gameEnded: boolean;
  public gameOf: number;

  public turnIndex: number;
  public playingPlayers: {
    playerId: string;
    label: number;
    color: string;
    playing: boolean;
  }[];
  public canPlayerThrowDice: boolean;

  public startedAt: Date = new Date(Date.now());

  constructor(gameOf: number) {
    this.gameId = crypto.randomUUID();
    this.gameStarted = false;
    this.gameEnded = false;
    this.gameOf = gameOf;

    this.players = [];
    this.turnIndex = 0;
    this.canPlayerThrowDice = false;
    this.playingPlayers = [];
  }

  public addPlayer(player: Player) {
    if (this.gameStarted || this.gameEnded) return;

    this.players.push(player);

    if (this.gameOf === this.players.length) {
      this.startGame();
    }

    this.sendUpdate();
  }

  private snapshot() {
    return {
      players: this.players.map((ply) => ({
        displayName: ply ? ply.displayName : null,
        avatar: ply ? ply.avatar : null,
        email: ply ? ply.email : null,
        playerId: ply ? ply.playerId : null,
      })),
      playingPlayers: this.playingPlayers.map((p) => p),
      gameOf: this.gameOf,
      gameStarted: this.gameStarted,
      gameEnded: this.gameEnded,
      gameId: this.gameId,
      turnIndex: this.turnIndex,
    };
  }

  public sendUpdate() {
    if (this.gameEnded) {
      socketManager.broadcast(this.gameId, {
        type: GAME_OVER,
      });
    } else if (this.gameStarted) {
      socketManager.broadcast(this.gameId, {
        type: GAME_UPDATE,
        ...this.snapshot(),
      });
    } else {
      socketManager.broadcast(this.gameId, {
        type: LOBBY_UPDATE,
        ...this.snapshot(),
      });
    }
  }

  public sendUpdateTo(playerId: string) {
    if (this.gameEnded) {
      socketManager.sendMessageTo(playerId, {
        type: GAME_OVER,
      });
    } else if (this.gameStarted) {
      socketManager.sendMessageTo(playerId, {
        type: GAME_UPDATE,
        ...this.snapshot(),
      });
    } else {
      socketManager.sendMessageTo(playerId, {
        type: LOBBY_UPDATE,
        ...this.snapshot(),
      });
    }
  }

  public startGame(): "error" | "ok" {
    const emptySlot = this.players.some((p) => p === null);

    if (emptySlot) {
      return ERROR;
    }

    this.gameStarted = true;
    this.canPlayerThrowDice = true;

    this.playingPlayers = this.players.map((p, i) => ({
      playerId: p!.playerId,
      label: 1,
      color: playersColors[i] || "purple",
      playing: true,
    }));

    return "ok";
  }

  public endGame() {
    this.gameEnded = true;
    this.sendUpdate();
    this.players = [];
    this.gameStarted = false;
    this.canPlayerThrowDice = false;
    this.playingPlayers = [];
    console.log("Game :: Game over", this.gameId);
  }

  public async move(playerId: string): Promise<"ok" | "error" | "game_over"> {
    if (
      this.playingPlayers.find((p) => p.playerId === playerId)?.playing ===
      false
    ) {
      console.log(RED_ASCII, "Game :: Non playing player is throwing dice");
      return ERROR;
    }
    if (this.playingPlayers[this.turnIndex]!.playerId !== playerId) {
      console.log(RED_ASCII, "Game :: Wrong player movement");
      return ERROR;
    }
    if (!this.canPlayerThrowDice) {
      console.log(RED_ASCII, "Game :: Dice throw blocked");
      return ERROR;
    }

    const gameId = socketManager.getGameId(playerId);

    if (!gameId) {
      console.log(RED_ASCII, "Game :: Playing without gameId");
      return ERROR;
    }

    this.canPlayerThrowDice = false;

    const diceNumber = Math.floor(Math.random() * 6) + 1;

    await new Promise((res) => setTimeout(res, 400));

    socketManager.broadcast(gameId, {
      type: DICE_NUMBER,
      playerId,
      turnIndex: this.turnIndex,
      number: diceNumber,
    });

    await new Promise((res) => setTimeout(res, 400));

    if (this.playingPlayers[this.turnIndex]!.label + diceNumber <= 100) {
      this.playingPlayers[this.turnIndex]!.label += diceNumber;

      socketManager.broadcast(gameId, {
        type: MOVE,
        playerId,
        turnIndex: this.turnIndex,
        to: this.playingPlayers[this.turnIndex]!.label,
        steps: diceNumber,
      });

      await new Promise((res) => setTimeout(res, diceNumber * 300)); // Because animation is playing at client side

      const { x, y } = labelToCoord(this.playingPlayers[this.turnIndex]!.label);

      if (BOARD[y]![x] !== -1) {
        this.playingPlayers[this.turnIndex]!.label = BOARD[y]![x]!;

        await new Promise((res) => setTimeout(res, 300));

        socketManager.broadcast(gameId, {
          type: MOVE,
          playerId,
          turnIndex: this.turnIndex,
          to: this.playingPlayers[this.turnIndex]!.label,
        });
      }
    }

    if (this.playingPlayers[this.turnIndex]!.label === 100)
      this.playingPlayers[this.turnIndex]!.playing = false;

    await new Promise((res) => setTimeout(res, 300));

    const activePlayers = this.playingPlayers.filter((p) => p.playing).length;

    if (activePlayers <= 1) {
      this.endGame();

      return GAME_OVER;
    }

    this.advanceTurn();

    this.canPlayerThrowDice = true;

    return "ok";
  }

  public advanceTurn() {
    let flag = 0;
    do {
      this.turnIndex = (this.turnIndex + 1) % this.playingPlayers.length;

      flag++;

      if (flag > 10) {
        console.log(RED_ASCII, "Game :: While loop is running infinite times");
        break;
      }
    } while (this.playingPlayers[this.turnIndex]!.playing === false);

    socketManager.broadcast(this.gameId, {
      type: SET_TURN,
      turnIndex: this.turnIndex,
      playerId: this.playingPlayers[this.turnIndex]?.playerId,
    });
  }

  public removePlayer(playerId: string): "ok" | "error" | "game_over" {
    if (this.gameEnded) {
      console.log(RED_ASCII, "Game :: Removing player which is over");
      return ERROR;
    }
    if (this.gameStarted) {
      const playerIndex = this.playingPlayers.findIndex(
        (p) => p.playerId === playerId,
      );

      if (playerIndex === -1) {
        console.log(RED_ASCII, "Game :: Removing player which does not exist");
        return ERROR;
      }

      this.players[playerIndex] = null;
      this.playingPlayers[playerIndex]!.playing = false;
      this.playingPlayers[playerIndex]!.playerId = "";

      const activePlayers = this.playingPlayers.filter((p) => p.playing).length;

      if (activePlayers <= 1) {
        this.endGame();

        return GAME_OVER;
      }

      if (playerIndex === this.turnIndex) {
        this.advanceTurn();
      }
    } else {
      this.players = this.players.filter((p) => p && p.playerId !== playerId);

      if (this.players.length === 0) {
        this.endGame();
        return GAME_OVER;
      }
    }

    this.sendUpdate();

    return "ok";
  }
}

export default Game;
