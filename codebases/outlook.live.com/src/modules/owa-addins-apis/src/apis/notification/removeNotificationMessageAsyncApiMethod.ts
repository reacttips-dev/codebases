import removeNotificationMessage from './removeNotificationMessage';
import type { ApiMethodCallback } from '../ApiMethod';

export interface RemoveNotificationMessageArgs {
    key: string;
}

export default async function removeNotificationMessageAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: RemoveNotificationMessageArgs,
    callback: ApiMethodCallback
) {
    const result = await removeNotificationMessage(hostItemIndex, controlId, data.key);
    callback(result);
}
