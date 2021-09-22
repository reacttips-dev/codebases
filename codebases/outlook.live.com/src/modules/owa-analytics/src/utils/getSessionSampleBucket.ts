let sessionBucket: number;
export default function getSessionSampleBucket() {
    // bucketize into [0, 9999]
    if (sessionBucket === undefined) {
        sessionBucket = Math.floor(Math.random() * 10000);
    }

    return sessionBucket;
}

export function isCurrentSessionInSample(sampleRate: number) {
    return getSessionSampleBucket() < sampleRate * 100;
}
