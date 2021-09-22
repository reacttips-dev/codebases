import { action } from 'satcheljs';

export const addPendingRequest = action('addPendingRequest', (correlationId: string) => ({
    correlationId,
}));

export const removePendingRequest = action('removePendingRequest', (correlationId: string) => ({
    correlationId,
}));
