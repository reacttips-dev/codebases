import { createRetriableFunction, createExponentialBackoffFunction } from 'owa-retriable-function';

export const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});
