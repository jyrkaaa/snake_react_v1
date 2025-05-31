import {GameBoard} from "@/game/engine/GameEngine";
import {Direction} from "@/game/types";

export interface GameState {
    elapsedTime: number ;
    isRunning: boolean;
    board: GameBoard | null
    stopGame: () => void;
    startGame: () => void;
    changeDirection: (dir: Direction) => void;
}


