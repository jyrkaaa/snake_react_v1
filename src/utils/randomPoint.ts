import {Point, Segment} from "@/game/engine/GameEngine";
import {PointType} from "@/game/types";
import {pointTypes} from "@/game/types";

export function generateRandomPoint(rows: number, cols: number, segments: Segment[]) {
    let point: Point
    do {
        point = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
            pointType: generatePointType(),
        }
    } while (segments.some(seg => seg.x === point.x && seg.y === point.y))
    return point;
}
export function generatePointType(): PointType {
    const rand = Math.random(); // random number between 0 and 1
    let acc = 0;

    for (const entry of pointTypes) {
        acc += entry.probability;
        if (rand < acc) {
            return entry.point;
        }
    }

    // fallback (in case of floating point imprecision)
    return pointTypes[pointTypes.length - 1].point;
}
