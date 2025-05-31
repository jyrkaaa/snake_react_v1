
import { useState } from "react";
import { defaultGameRules, GameRules } from "@/game/rules/GameRules";

export default function GameRulesMenu({ onStart }: { onStart: (rules: GameRules) => void }) {
    const [rules, setRules] = useState<GameRules>(defaultGameRules);

    const updatePlayerRule = (key: keyof typeof rules.player, value: number) => {
        setRules(prev => ({
            ...prev,
            player: {
                ...prev.player,
                [key]: value,
            }
        }));
    };

    const updateBoardRule = (key: keyof typeof rules.board, value: number) => {
        setRules(prev => ({
            ...prev,
            board: {
                ...prev.board,
                [key]: value,
            }
        }));
    };

    return (
        <div className="p-4 bg-dark text-white rounded">
            <h3>Customize Game Rules</h3>
            <div className="mb-3">
                <label>Board Width</label>
                <input type="number" value={rules.board.width} onChange={e => updateBoardRule('width', Number(e.target.value))} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Board Height</label>
                <input type="number" value={rules.board.height} onChange={e => updateBoardRule('height', Number(e.target.value))} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Player Speed</label>
                <input type="number" value={rules.player.playerSpeed} onChange={e => updatePlayerRule('playerSpeed', Number(e.target.value))} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Speed Boost Multiplier</label>
                <input type="number" value={rules.player.playerSpeedMultiplier} onChange={e => updatePlayerRule('playerSpeedMultiplier', Number(e.target.value))} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Speed Boost Duration (sec)</label>
                <input type="number" value={rules.player.speedBoostDuration} onChange={e => updatePlayerRule('speedBoostDuration', Number(e.target.value))} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Invincibility Duration (sec)</label>
                <input type="number" value={rules.player.invincibilityDuration} onChange={e => updatePlayerRule('invincibilityDuration', Number(e.target.value))} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Invincibility Speed Multiplier</label>
                <input type="number" value={rules.player.invincibilitySpeedMultiplier} onChange={e => updatePlayerRule('invincibilitySpeedMultiplier', Number(e.target.value))} className="form-control" />
            </div>

            <button className="btn btn-primary mt-3" onClick={() => onStart(rules)}>
                Start Game
            </button>
        </div>
    )
}
