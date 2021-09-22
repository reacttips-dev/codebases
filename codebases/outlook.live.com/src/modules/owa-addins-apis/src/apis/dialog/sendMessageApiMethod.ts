import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { DialogMessageParentArgs, OutlookEventDispId, triggerApiEvent } from 'owa-addins-events';

export default function sendMessageApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DialogMessageParentArgs,
    callback: ApiMethodCallback
): void {
    triggerApiEvent(OutlookEventDispId.DIALOG_PARENT_MESSAGE_RECEIVED, controlId, data, () => {
        callback(createSuccessResult());
    });
}
