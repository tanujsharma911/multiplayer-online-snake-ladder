import { RED_ASCII } from "./contants.js";
import { ADDED, DICE_NUMBER, ERROR, GAME_OVER, MOVE } from "./messages.js";
import { Player, socketManager } from "./SocketManager.js";
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
  public players: Player[];
  public gameStarted: boolean;
  public gameOf: number;

  public turnIndex: number;
  public playingPlayers: { playerId: string; label: number; color: string }[];
  public canPlayerThrowDice: boolean;

  public startedAt: Date = new Date(Date.now());

  constructor(gameOf: number) {
    this.gameId = crypto.randomUUID();
    this.gameStarted = false;
    this.gameOf = gameOf;

    this.players = [];
    this.turnIndex = 0;
    this.canPlayerThrowDice = true;
    this.playingPlayers = [];

    // this.playingPlayers = playersIds.map((player, i) => ({
    //   playerId: player,
    //   label: 1,
    //   color: playersColor[i] || "purple",
    // }));
  }

  public addPlayer(player: Player) {
    this.players.push(player);

    socketManager.broadcast(this.gameId, {
      type: ADDED,
      players: this.players.map((ply) => ({
        displayName: ply.displayName,
        avatar: ply.avatar,
        email: ply.email,
      })),
      gameOf: this.gameOf,
      gameStarted: this.gameStarted,
    });
  }

  public startGame() {
    this.gameStarted = true;

    // create playingPlayers array
    // broadcast message to all players
  }

  public async move(playerId: string) {
    if (this.playingPlayers[this.turnIndex]!.playerId !== playerId) {
      console.log("🔴 Wrong player movement");
      return ERROR;
    }
    if (!this.canPlayerThrowDice) {
      console.log("🔴 Dice throw blocked");
      return ERROR;
    }

    const gameId = socketManager.getGameId(playerId);

    if (!gameId) {
      console.log(RED_ASCII, "Game :: Playing without gameId");
      return;
    }

    this.canPlayerThrowDice = false;

    console.log("👉 Turn:", playerId, "index:", this.turnIndex);

    const diceNumber = Math.floor(Math.random() * 6) + 1;

    console.log("👉    Dice number:", diceNumber);

    socketManager.broadcast(gameId, {
      type: DICE_NUMBER,
      playerId,
      turnIndex: this.turnIndex,
      number: diceNumber,
    });

    if (this.playingPlayers[this.turnIndex]!.label + diceNumber <= 100) {
      this.playingPlayers[this.turnIndex]!.label += diceNumber;

      console.log("👉    move to:", this.playingPlayers[this.turnIndex]!.label);

      socketManager.broadcast(gameId, {
        type: MOVE,
        playerId,
        turnIndex: this.turnIndex,
        to: this.playingPlayers[this.turnIndex]!.label,
      });

      await new Promise((res) => setTimeout(res, diceNumber * 300)); // Because animation is playing at client side

      const { x, y } = labelToCoord(this.playingPlayers[this.turnIndex]!.label);

      if (BOARD[y]![x] !== -1) {
        this.playingPlayers[this.turnIndex]!.label = BOARD[y]![x]!;

        console.log("👉    go to:", BOARD[y]![x]);

        socketManager.broadcast(gameId, {
          type: MOVE,
          playerId,
          turnIndex: this.turnIndex,
          to: this.playingPlayers[this.turnIndex]!.label,
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
      return GAME_OVER;
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
