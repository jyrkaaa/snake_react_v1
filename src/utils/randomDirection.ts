import {Direction} from "@/game/types";

export function generateSafeRandomDirection(
    currentDir: Direction,
    x: number,
    y: number,
    width: number,
    height: number
): Direction {
    const opposites: Record<Direction, Direction> = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left',
    };

    const allDirections: Direction[] = ['up', 'down', 'left', 'right'];

    const validDirections = allDirections.filter((dir) => {
        if (dir === currentDir || dir === opposites[currentDir]) {
            return false; // skip current and opposite
        }

        // Prevent hitting walls
        switch (dir) {
            case 'left':
                return x > 0;
            case 'right':
                return x < width - 1;
            case 'up':
                return y > 0;
            case 'down':
                return y < height - 1;
        }

    });

    // Fallback: if no valid directions (shouldn’t happen), return current
    if (validDirections.length === 0) return currentDir;

    const index = Math.floor(Math.random() * validDirections.length);
    return validDirections[index];
}
