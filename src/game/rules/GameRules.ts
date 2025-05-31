import {BoardRules, defaultBoardRules} from "@/game/rules/BoardRules";
import {defaultPlayerRules, PlayerRules} from "@/game/rules/PlayerRules";

export interface GameRules {
    board: BoardRules;
    player: PlayerRules;
}
export const defaultGameRules: GameRules = {
    board: defaultBoardRules,
    player: defaultPlayerRules,
}