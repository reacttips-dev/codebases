import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getExtensibilityState } from 'owa-addins-store';

export default function getInitializationContextApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const { taskPanes } = getExtensibilityState();
    let taskPanesForHostItemIndex = taskPanes.get(hostItemIndex);
    let initializationContext = '';
    [...taskPanesForHostItemIndex.values()].forEach(element => {
        if (element.initializationContext) {
            initializationContext = element.initializationContext;
        }
    });

    //Adding this check instead of if(initializationContext){} because we want to return success in case of empty result
    if (initializationContext != null && initializationContext != undefined) {
        callback(createSuccessResult(initializationContext));
    } else {
        callback(createErrorResult());
    }
}
