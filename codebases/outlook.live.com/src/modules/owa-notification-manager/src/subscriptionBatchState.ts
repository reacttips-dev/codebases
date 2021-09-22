import type NotificationSubscription from './schema/NotificationSubscription';

let batchState: NotificationSubscription[] = [];
let pendingSubmission = false;

export const getBatch = () => batchState;
export const addToBatch = (subscription: NotificationSubscription) => batchState.push(subscription);
export const clearBatch = () => (batchState = []);

export const setPending = pending => (pendingSubmission = pending);
export const isPending = () => pendingSubmission;
