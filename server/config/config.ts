export const config = {
    "ticksPerSecond": 10,
};

export const convertSecondsToTicks = (seconds: number) => {
    return seconds * config.ticksPerSecond;
}