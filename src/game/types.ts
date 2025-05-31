export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PointType {
    typeName: string;
    numVal: number;
    color: string;
}
export const pointTypes: { point: PointType; probability: number }[] = [
    {point: { typeName: 'default', numVal: 1, color: "#dc3545"}, probability: 0.3 },
    {point: {typeName: 'extraPoints', numVal: 5, color: "#ac30b3"}, probability: 0.1 },
    {point: {typeName: 'speedBoost', numVal: 2, color: "#d6d423"}, probability: 0.1 },
    {point: {typeName: 'invincibleModifier', numVal: 3, color: "#18c390"}, probability: 0.5 },
]