import { getAdapter, AppointmentComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export interface SetLocationArgs {
    location: string;
}

export default function setLocationAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SetLocationArgs,
    callback: ApiMethodCallback
) {
    if (data.location == null) {
        callback(createErrorResult(null));
        return;
    }

    const adapter = getAdapter(hostItemIndex) as AppointmentComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    adapter.setLocation(data.location);
    callback(createSuccessResult());
}
