import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { DialogMessageParentArgs, OutlookEventDispId, triggerApiEvent } from 'owa-addins-events';

export default function messageParentApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DialogMessageParentArgs,
    callback: ApiMethodCallback
): void {
    triggerApiEvent(OutlookEventDispId.DISPLAY_DIALOG_DISPID, controlId, data, () => {
        callback(createSuccessResult());
    });
}
