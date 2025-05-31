'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {GameBoard, createBoard, updateBoard} from '@/game/engine/GameEngine'
import { GameRules } from '@/game/rules/GameRules'
import { GameState } from '@/game/state/GameState'
import { getVelocity } from '@/utils/velocity'
import { defaultBoardRules } from '@/game/rules/BoardRules'
import { defaultPlayerRules } from '@/game/rules/PlayerRules'
import { Direction } from '@/game/types' // helper to convert direction+speed to dx/dy
import { generateRandomPoint } from '@/utils/randomPoint'
import {generateSafeRandomDirection} from "@/utils/randomDirection";

const rules: GameRules = {
    board: defaultBoardRules,
    player: defaultPlayerRules,
}

const GameStateContext = createContext<GameState | undefined>(undefined)

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
    const boardRef = useRef<GameBoard | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const isRunningRef = useRef(false)
    const [board, setBoard] = useState<GameBoard | null>(null)
    const animationRef = useRef<number | null>(null)
    const timeRef = useRef<NodeJS.Timeout | null>(null)

    const startGameWithRules = (customRules: GameRules) => {
        rules.board = customRules.board;
        rules.player = customRules.player;
        startGame();
    }

    const startGame = () => {
        stopGame() // Stop any existing game

        const newBoard: GameBoard = createBoard(rules)
        setBoard(newBoard)
        setIsRunning(true)
        setElapsedTime(0)
        boardRef.current = newBoard;
        const boostMultiplier: number  = rules.player.playerSpeedMultiplier;
        const invincibilitySpeedMultiplier: number = rules.player.invincibilitySpeedMultiplier;

        const speed = rules.player.playerSpeed ?? 1
        let lastStepTime = performance.now();

        /* Modifier declarations */
        const boostDuration = rules.player.speedBoostDuration * 1000;
        const invincibilityDuration = rules.player.invincibilityDuration * 1000;
        //store modifier
        let currentModifier: { typeName: string; until: number } | null = null;

        // inside your GameStateProvider.startGame():
        const animate = (now: number) => {
            const current = boardRef.current!;
            const { board: next, gameOver, modifier } = updateBoard(current, rules); // boostActivate is boolean, true if activate

            if (modifier?.typeName === "speedBoost") {
                console.log("Speed Boost Activated");
                currentModifier = {
                    typeName: "speedBoost",
                    until: now + boostDuration
                };
            }
            if (modifier?.typeName === "invincibleModifier") {
                console.log("Invincible Mode Activated");
                currentModifier = {
                    typeName: "invincibleModifier",
                    until: now + invincibilityDuration
                };
            }

            const isModifierActive = currentModifier && now < currentModifier.until;
            const modifierType = isModifierActive ? currentModifier!.typeName : null;

            let effectiveSpeed = speed;
            if (modifierType === "speedBoost") {
                effectiveSpeed = speed * boostMultiplier;
            } else if (modifierType === "invincibleModifier") {
                effectiveSpeed = speed * invincibilitySpeedMultiplier;
            }

            const stepTime = 1000 / effectiveSpeed // milliseconds per move

            const delta = now - lastStepTime;

            if (delta >= stepTime) {
                if (gameOver) {
                    if (modifierType === "invincibleModifier" && isModifierActive) {
                        const head = { ...current!.player.segments[0]};
                        const newDir = generateSafeRandomDirection(
                            head.direction,
                            head.x,
                            head.y,
                            rules.board.width,
                            rules.board.height
                        );
                        changeDirection(newDir);
                        lastStepTime = now;
                    } else {
                        console.log("game stopped")
                        stopGame();
                        return;
                    }
                } else {
                    setBoard(next);
                    // update points/timer elsewhere if you like:
                    lastStepTime = now;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        }

        // Start the first animation frame
        animationRef.current = requestAnimationFrame(animate)

        // Start elapsed‐time counter
        timeRef.current = setInterval(() => {
            setElapsedTime((t) => t + 1)
        }, 1000)
    }

    const stopGame = () => {
        isRunningRef.current = false
        setIsRunning(false)

        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }

        if (timeRef.current) {
            clearInterval(timeRef.current)
            timeRef.current = null
        }
    }


    const changeDirection = (dir: Direction) => {
        setBoard((prev) => {
            if (!prev) return prev
            const currDirection = prev.player.segments[0].direction;

            const opposite: Record<Direction, Direction> = {
                up: 'down',
                down: 'up',
                left: 'right',
                right: 'left',
            };
            if (dir === opposite[currDirection]) return prev;

            const segments = [...prev.player.segments]
            segments[0] = {
                ...segments[0],
                direction: dir,
            }
            return {
                ...prev,
                player: {
                    ...prev.player,
                    segments: segments,
                },
            }
        })
    }

    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    const value: GameState = {
        elapsedTime,
        isRunning,
        board,
        stopGame,
        startGame,
        changeDirection,
        startGameWithRules
    }

    return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
}

export const useGameState = () => {
    const context = useContext(GameStateContext)
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider')
    }
    return context
}
