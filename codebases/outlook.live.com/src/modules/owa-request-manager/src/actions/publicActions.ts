import { action } from 'satcheljs';

export const poll = action(
    'poll',
    <T>(requestFunction: () => Promise<T> | T, requestIdentifier: string, interval: number) => ({
        requestFunction: requestFunction,
        requestIdentifier: requestIdentifier,
        interval: interval,
    })
);

export const cancelPoll = action('cancelPoll', (requestIdentifier: string) => ({
    requestIdentifier: requestIdentifier,
}));
