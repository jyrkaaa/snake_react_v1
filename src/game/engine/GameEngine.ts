import {Direction, PointType} from "@/game/types";
import {GameRules} from "@/game/rules/GameRules";
import {generatePointType, generateRandomPoint} from "@/utils/randomPoint"
import {getVelocity} from "@/utils/velocity"
import {act} from "react";

export interface Segment {
    x: number;
    y: number;
    direction: Direction;
}
export interface Player {
    segments: Segment[];
    speed: number;
    points: number
}
export interface Point {
    x: number;
    y: number;
    pointType: PointType;
}


export interface GameBoard {
    rows: number; // left to right
    cols: number; // Up to down
    player: Player;
    point: Point;
}
export function createBoard(rules: GameRules): GameBoard {
    const rows: number = rules.board.height;
    const cols: number = rules.board.width;
    const midX: number = Math.floor(cols / 2);
    const midY: number = Math.floor(rows / 2);


    const player : Player = {
        segments: [{ x: midX, y: midY, direction: 'right' }],
        speed: rules.player.playerSpeed,
        points: 0,
    }
    const point: Point = generateRandomPoint(rows, cols, player.segments);
    return {rows, cols, player, point};
}

/**
 * Move the snake forward one “step,” handle:
 *  - eating the point (grow + new point)
 *  - wall‐collision (game over)
 *  - self‐collision (game over)
 *
 * @returns
 *  - board: the new board state (with cloned arrays/objects)
 *  - gameOver: true if head hit wall or itself
 */
export function updateBoard(
    board: GameBoard,
    rules: GameRules
): { board: GameBoard; gameOver: boolean; modifier: PointType | null  } {
    const { rows, cols, player, point } = board;

    // 1) Clone all the segments so we never mutate old state
    const newSegments: Segment[] = player.segments.map((seg) => ({ ...seg }));

    // 2) Move head
    const head = { ...newSegments[0] };
    const { dx, dy } = getVelocity(head.direction, 1);
    head.x += dx;
    head.y += dy;
    newSegments[0] = head;

    // 3) Check for wall‐collision → game over
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {

        return { board, gameOver: true, modifier: null };
    }

    // 4) Shift body segments into place
    for (let i = 1; i < newSegments.length; i++) {
        // follow the previous position of segment[i-1]
        newSegments[i] = { ...player.segments[i - 1] };
    }

    // 5) Check for self‐collision → game over
    for (let i = 1; i < newSegments.length; i++) {
        if (
            newSegments[i].x === head.x &&
            newSegments[i].y === head.y
        ) {
            return { board, gameOver: true, modifier: null };
        }
    }

    let newPoint = point;
    let newPoints = player.points;
    let modifier: PointType | null = null;

    // 6) Check for eating the point → grow and respawn point
    if (head.x === point.x && head.y === point.y) {
        // push a copy of the tail to grow
        if (newPoint.pointType.typeName === "default") newPoints += newPoint.pointType.numVal;
        if (newPoint.pointType.typeName === "extraPoints") newPoints += newPoint.pointType.numVal;
        if (newPoint.pointType.typeName === "speedBoost") {
            newPoints += 1;
            modifier = {... newPoint.pointType};
        }
        if (newPoint.pointType.typeName === "invincibleModifier") {
            newPoints += 1;
            modifier = {...newPoint.pointType};
        }
            const tail = newSegments[newSegments.length - 1];
        newSegments.push({ ...tail });

        // award a new random point, avoiding the snake’s segments
        newPoint = generateRandomPoint(rows, cols, newSegments);
    }

    // 7) Return updated board
    const newBoard: GameBoard = {
        rows,
        cols,
        player: {
            ...player,
            segments: newSegments,
            points: newPoints
        },
        point: newPoint,
    };

    return { board: newBoard, gameOver: false, modifier: modifier };
}