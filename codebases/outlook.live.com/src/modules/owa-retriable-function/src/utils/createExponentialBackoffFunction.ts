export function createExponentialBackoffFunction(multiplierInMS: number) {
    return (retryCount: number): number => {
        // wait for (2^retryCount * multiplierInMS) milliseconds
        return Math.pow(2, retryCount) * multiplierInMS;
    };
}
