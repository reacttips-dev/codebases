import displayReplyFormApiMethodBase from './displayReplyFormApiMethodBase';
import type DisplayReplyFormArgs from './DisplayReplyFormArgs';
import type { ApiMethodCallback } from '../ApiMethod';

export default async function displayReplyFormApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayReplyFormArgs,
    callback: ApiMethodCallback
) {
    await displayReplyFormApiMethodBase(
        hostItemIndex,
        controlId,
        data,
        callback,
        false /* isReplyAll */
    );
}
