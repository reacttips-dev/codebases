import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, AppointmentComposeAdapter } from 'owa-addins-adapters';

export default function getLocationAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex) as AppointmentComposeAdapter;
    const location: string = adapter.getLocation() || '';
    callback(createSuccessResult(location));
}
