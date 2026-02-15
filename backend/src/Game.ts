import { DICE_NUMBER, MOVE } from "./messages.js";
import { socketManager } from "./SocketManager.js";
import { labelToCoord } from "./utils.js";

interface GameType {
  gameId: string;
  playersIds:
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]; // PLayers can be 2, 3, or 4 only in one game
}

const playersColor = ["red", "green", "yellow", "sky"];

const BOARD: number[][] = [
  [-1, -1, -1, 76, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, 93, -1, -1, -1],
  [-1, -1, -1, 42, -1, -1, -1, -1, -1, -1],
  [-1, 98, -1, -1, -1, -1, -1, 32, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, 75, -1, -1],
  [-1, -1, -1, -1, -1, -1, 16, -1, -1, -1],
  [-1, -1, -1, 56, -1, -1, -1, -1, -1, -1],
  [-1, 4, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 28, -1],
];

class Game {
  public gameId: string;
  public playersIds: string[];

  public turnIndex: number;
  public playingPlayers: { playerId: string; label: number; color: string }[];
  public canPlayerThrowDice: boolean;

  public startedAt: Date = new Date(Date.now());

  constructor({ gameId, playersIds }: GameType) {
    this.gameId = gameId;
    this.playersIds = playersIds || [];
    this.turnIndex = 0;
    this.canPlayerThrowDice = true;

    this.playingPlayers = playersIds.map((player, i) => ({
      playerId: player,
      label: 1,
      color: playersColor[i] || "purple",
    }));
  }

  public async move(playerId: string) {
    if (this.playingPlayers[this.turnIndex]!.playerId !== playerId) {
      console.log("🔴 Wrong player movement");
      return "error";
    }
    if (!this.canPlayerThrowDice) {
      console.log("🔴 Dice throw blocked");
      return "error";
    }

    this.canPlayerThrowDice = false;

    console.log("👉 Turn:", playerId, "index:", this.turnIndex);

    const diceNumber = Math.floor(Math.random() * 6) + 1;

    console.log("👉    Dice number:", diceNumber);

    socketManager.broadcast({
      playerId,
      message: {
        type: DICE_NUMBER,
        playerId,
        turnIndex: this.turnIndex,
        number: diceNumber,
      },
    });

    if (this.playingPlayers[this.turnIndex]!.label + diceNumber <= 100) {
      this.playingPlayers[this.turnIndex]!.label += diceNumber;

      console.log("👉    move to:", this.playingPlayers[this.turnIndex]!.label);

      socketManager.broadcast({
        playerId,
        message: {
          type: MOVE,
          playerId,
          turnIndex: this.turnIndex,
          to: this.playingPlayers[this.turnIndex]!.label,
        },
      });

      await new Promise((res) => setTimeout(res, diceNumber * 300)); // Because animation is playing at client side

      const { x, y } = labelToCoord(this.playingPlayers[this.turnIndex]!.label);

      if (BOARD[y]![x] !== -1) {
        this.playingPlayers[this.turnIndex]!.label = BOARD[y]![x]!;

        console.log("👉    go to:", BOARD[y]![x]);

        socketManager.broadcast({
          playerId,
          message: {
            type: MOVE,
            playerId,
            turnIndex: this.turnIndex,
            to: this.playingPlayers[this.turnIndex]!.label,
          },
        });
      }
    }

    await new Promise((res) => setTimeout(res, 300));

    const activePlayers = this.playingPlayers.filter(
      (p) => p.label < 100,
    ).length;

    console.log("👉 Active players:", activePlayers);

    if (activePlayers <= 1) {
      console.log("👉 GAME_OVER");
      return "game_over";
    }

    while (this.playingPlayers[this.turnIndex]!.label === 100) {
      this.turnIndex = (this.turnIndex + 1) % this.playingPlayers.length;
    }

    console.log("👉 Now turns: ", this.turnIndex);

    this.canPlayerThrowDice = true;

    return "ok";
  }
}

export default Game;
