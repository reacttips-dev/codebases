import { action } from 'satcheljs';

export const getActionInfoAndSetStore = action(
    'getActionInfoAndSetStore',
    (
        alchemyId: string,
        bucketId: string,
        bucketTitle: string,
        bucketDescription: string,
        invokedBy: string,
        requestId: string,
        ruleId: string
    ) => ({
        alchemyId,
        bucketId,
        bucketTitle,
        bucketDescription,
        invokedBy,
        requestId,
        ruleId,
    })
);
