import { Direction } from '@/game/types'

export const getVelocity = (direction: Direction, speed: number) => {
    switch (direction) {
        case 'up': return { dx: 0, dy: -speed }
        case 'down': return { dx: 0, dy: speed }
        case 'left': return { dx: -speed, dy: 0 }
        case 'right': return { dx: speed, dy: 0 }
        default: return { dx: 0, dy: 0 }
    }
}