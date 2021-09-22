import { actionInfoMap } from '../utils/actionInfoMap';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logFmsAction } from './logFmsAction';
import type { ActionInfo } from 'owa-feedback-mitigation';

export function getActionByFilter(
    invokedBy: string,
    requestId: string,
    filter: string
): ActionInfo {
    if (isFeatureEnabled('fms-dialog-action')) {
        if (filter in actionInfoMap) {
            logFmsAction(invokedBy, requestId, filter, true);
            return actionInfoMap[filter];
        } else {
            logFmsAction(invokedBy, requestId, filter, false);
        }
    }

    return null;
}
