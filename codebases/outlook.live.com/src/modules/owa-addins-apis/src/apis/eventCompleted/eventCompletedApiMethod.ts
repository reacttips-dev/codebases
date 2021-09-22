import type { ApiMethodCallback } from '../ApiMethod';
import 'owa-addins-osfruntime';

export default function eventCompletedApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    OfficeExt.AddinCommandsRuntimeManager.invocationCompleted(controlId, data);
}
