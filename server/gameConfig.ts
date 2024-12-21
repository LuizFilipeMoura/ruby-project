export const gameConfig = {
    ticksPerSecond: 10
}

export function calculateTicks(seconds: number): number {
    return seconds * gameConfig.ticksPerSecond;
}
