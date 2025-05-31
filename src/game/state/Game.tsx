'use client'

import {useEffect, useState} from "react";
import {useGameState} from "@/game/state/GameStateProvider";
import {GameRules} from "@/game/rules/GameRules";
import GameRulesMenu from "@/components/GameRulesMenu";

export default function Game() {
    const {
        board,
        isRunning,
        startGame,
        changeDirection,
        startGameWithRules,
    } = useGameState();

    const [showMenu, setShowMenu] = useState(true);

    const handleStart = (rules: GameRules) => {
        if (startGameWithRules) {
            startGameWithRules(rules);
        } else {
            startGame();
        }
        setShowMenu(false);
    };
    const openMenu = () => {
        setShowMenu(true);
    }


    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const map: { [key: string]: 'up' | 'down' | 'left' | 'right' } = {
                ArrowUp: 'up',
                ArrowDown: 'down',
                ArrowLeft: 'left',
                ArrowRight: 'right',
                w: 'up',
                a: 'left',
                s: 'down',
                d: 'right',
            }
            const dir = map[e.key];
            if (dir && isRunning) {
                changeDirection(dir);
            }
        }
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isRunning, changeDirection]);

    if (showMenu) {
        return (

            <div className="container py-5">
                <GameRulesMenu onStart={handleStart} />
            </div>
        );
    }

    return (
        <div className="container-fluid bg-dark text-white min-vh-100 d-flex flex-column align-items-center pt-4 fixed-position">
            <div className="mb-4">
                {!isRunning && (
                    <div>
                        <button
                            onClick={startGame}
                            className="btn btn-success px-4 py-2"
                        >
                            Start Game
                        </button>
                        <button
                            onClick={openMenu}
                            className="btn btn-success px-4 py-2 ml-4"
                        >
                            Open Menu
                        </button>
                    </div>

                )}
                {isRunning && (
                    <div className="mb-4">
                        <p>Point Currently: {board?.player.points}</p>
                    </div>
                )}
            </div>

            {isRunning && board && (
                <div
                    className="d-grid border border-secondary bg-secondary overflow-auto"
                    style={{
                        maxWidth: '1200px',
                        maxHeight: '760px',
                        width: `${board.cols * 32}px`,
                        height: `${board.rows * 32}px`,
                        gridTemplateColumns: `repeat(${board.cols}, 32px)`,
                    }}
                >
                    {Array.from({ length: board.rows * board.cols }).map((_, idx) => {
                        const x = idx % board.cols
                        const y = Math.floor(idx / board.cols)
                        const isPlayer = Array.isArray(board?.player?.segments)
                            ? board.player.segments.some(seg => seg.x === x && seg.y === y)
                            : false;

                        const isPoint = board?.point && board.point.x === x && board.point.y === y;
                        let pointColor: string = "";
                        if (isPoint) {
                            pointColor = board.point.pointType.color
                        }
                        return (

                            <div
                                key={idx}
                                className={`border border-dark`}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: isPlayer ? '#0d6efd' : isPoint ? pointColor : '#343a40',
                                }}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
