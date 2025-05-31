import {GameBoard} from "@/game/engine/GameEngine";
import {Direction} from "@/game/types";
import {GameRules} from "@/game/rules/GameRules";

export interface GameState {
    elapsedTime: number ;
    isRunning: boolean;
    board: GameBoard | null
    stopGame: () => void;
    startGame: () => void;
    changeDirection: (dir: Direction) => void;
    startGameWithRules?: (rules: GameRules) => void;
}


