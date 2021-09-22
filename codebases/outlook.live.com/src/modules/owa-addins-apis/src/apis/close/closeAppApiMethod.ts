import closeTaskPaneAddinCommandByControlId from '../../utils/closeTaskPaneAddinCommandByControlId';
import isContextualCalloutRunning from '../../utils/isContextualCalloutRunning';
import isTaskPaneRunning from '../../utils/isTaskPaneRunning';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { terminateContextualCallout } from 'owa-addins-store';

export default function closeAppApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    if (isTaskPaneRunning(controlId)) {
        closeTaskPaneAddinCommandByControlId(controlId);
    } else if (isContextualCalloutRunning(controlId)) {
        terminateContextualCallout();
    }

    callback(createSuccessResult());
}
