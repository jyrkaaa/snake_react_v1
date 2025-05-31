export interface PlayerRules {
    playerSpeed: number;
    playerPointsMultiplier: number;
    playerMaxSize: number;
    playerMinSize: number;
    playerSpeedMultiplier: number;
    speedBoostDuration: number;
    invincibilityDuration: number;
    invincibilitySpeedMultiplier: number;
}
export const defaultPlayerRules: PlayerRules = {
    playerMaxSize: 25,
    playerSpeed: 5,
    playerMinSize: 1,
    playerPointsMultiplier: 1,
    playerSpeedMultiplier: 2,
    speedBoostDuration: 5,
    invincibilityDuration: 10,
    invincibilitySpeedMultiplier: 10
}
