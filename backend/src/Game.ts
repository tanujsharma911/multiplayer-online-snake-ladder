import { BOARD, RED_ASCII } from "./contants.js";
import {
  LOBBY_UPDATE,
  DICE_NUMBER,
  ERROR,
  GAME_OVER,
  MOVE,
  GAME_UPDATE,
  SET_TURN,
  OK,
} from "./messages.js";
import { Player, socketManager } from "./SocketManager.js";
import type { GameResult } from "./types.js";
import { labelToCoord } from "./utils.js";

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
  public turnTimer: NodeJS.Timeout | null = null;

  constructor(gameOf: number) {
    this.gameId = crypto.randomUUID().slice(0, 4);
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
    socketManager.addPlayer(player, this.gameId);

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

  public startTimer() {
    // Clear previous timer if exists
    if (this.turnTimer) clearTimeout(this.turnTimer);

    this.turnTimer = setTimeout(() => {
      const playingPlayers = this.playingPlayers.filter(
        (p) => p.playing,
      ).length;

      if (playingPlayers <= 2) {
        this.endGame();
        return;
      }

      this.removePlayer(this.playingPlayers[this.turnIndex]!.playerId);
      this.advanceTurn();
      this.canPlayerThrowDice = true;
    }, 30 * 1000);
  }

  public startGame(): GameResult {
    const emptySlot = this.players.some((p) => p === null);

    if (emptySlot) {
      console.log(
        RED_ASCII,
        "Game :: startGame :: Starting game with empty slot",
      );
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

    this.startTimer();

    return OK;
  }

  public endGame() {
    this.gameEnded = true;
    this.turnTimer && clearTimeout(this.turnTimer);
    this.sendUpdate();
    this.players = [];
    this.gameStarted = false;
    this.canPlayerThrowDice = false;
    this.playingPlayers = [];
    socketManager.removeGame(this.gameId);
  }

  public async move(playerId: string): Promise<GameResult> {
    const currentTurnIndex = this.turnIndex;
    const currentPlayer = this.playingPlayers.find(
      (p) => p.playerId === playerId,
    );
    if (!currentPlayer || currentPlayer.playing === false) {
      console.log(RED_ASCII, "Game :: Non playing player is throwing dice");
      return ERROR;
    }
    if (currentPlayer.playerId !== playerId) {
      console.log(RED_ASCII, "Game :: Wrong player movement");
      return ERROR;
    }
    if (!this.canPlayerThrowDice) {
      console.log(RED_ASCII, "Game :: Dice throw blocked");
      return ERROR;
    }

    const gameId = socketManager.getGameId(playerId);

    if (!gameId) {
      console.log(RED_ASCII, "Game :: move :: Playing without gameId");
      return ERROR;
    }

    this.canPlayerThrowDice = false;

    const diceNumber = Math.floor(Math.random() * 6) + 1;

    const isStateValid = () => {
      if (this.gameEnded) return false; // Catches if the array was cleared
      if (this.turnIndex !== currentTurnIndex) return false; // Catches turn hijacks
      if (!currentPlayer.playing) return false; // Catches disconnected players
      return true;
    };

    await new Promise((res) => setTimeout(res, 400));

    if (!isStateValid()) {
      console.log(
        RED_ASCII,
        "Game :: move :: Player left during dice animation",
      );
      return ERROR;
    }

    socketManager.broadcast(gameId, {
      type: DICE_NUMBER,
      playerId,
      turnIndex: this.turnIndex,
      number: diceNumber,
    });

    await new Promise((res) => setTimeout(res, 400));

    if (!isStateValid()) {
      console.log(
        RED_ASCII,
        "Game :: move :: Player left during dice animation",
      );
      return ERROR;
    }

    if (currentPlayer.label + diceNumber <= 100) {
      currentPlayer.label += diceNumber;

      socketManager.broadcast(gameId, {
        type: MOVE,
        playerId,
        turnIndex: this.turnIndex,
        to: currentPlayer.label,
        steps: diceNumber,
      });

      await new Promise((res) => setTimeout(res, diceNumber * 300)); // Because animation is playing at client side

      if (!isStateValid()) {
        console.log(
          RED_ASCII,
          "Game :: move :: Player left during dice animation",
        );
        return ERROR;
      }

      const { x, y } = labelToCoord(currentPlayer.label);

      if (BOARD[y]![x] !== -1) {
        currentPlayer.label = BOARD[y]![x]!;

        await new Promise((res) => setTimeout(res, 300));

        if (!isStateValid()) {
          console.log(
            RED_ASCII,
            "Game :: move :: Player left during dice animation",
          );
          return ERROR;
        }

        socketManager.broadcast(gameId, {
          type: MOVE,
          playerId,
          turnIndex: this.turnIndex,
          to: currentPlayer.label,
        });
      }
    }

    if (currentPlayer.label === 100) currentPlayer.playing = false;

    await new Promise((res) => setTimeout(res, 300));

    if (!isStateValid()) {
      console.log(
        RED_ASCII,
        "Game :: move :: Player left during dice animation",
      );
      return ERROR;
    }

    const activePlayers = this.playingPlayers.filter((p) => p.playing).length;

    if (activePlayers <= 1) {
      this.endGame();

      return GAME_OVER;
    }

    this.advanceTurn();

    this.canPlayerThrowDice = true;

    return OK;
  }

  public advanceTurn() {
    let flag = 0;
    do {
      this.turnIndex = (this.turnIndex + 1) % this.playingPlayers.length;

      flag++;

      if (flag > this.playingPlayers.length + 1) {
        console.log(RED_ASCII, "Game :: While loop is running infinite times");
        break;
      }
    } while (this.playingPlayers[this.turnIndex]!.playing === false);

    this.startTimer();

    socketManager.broadcast(this.gameId, {
      type: SET_TURN,
      turnIndex: this.turnIndex,
      playerId: this.playingPlayers[this.turnIndex]?.playerId,
    });
  }

  public removePlayer(playerId: string): GameResult {
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

    return OK;
  }
}

export default Game;
