import getExtensibilityState from '../store/getExtensibilityState';
import type InvokeAppAddinCommandStatusCode from '../store/schema/enums/InvokeAppAddinCommandStatusCode';
import { resolvePendingUILess } from '../store/pendingUILess';
import { action } from 'satcheljs/lib/legacy';

export default action('terminateUiLessExtendedAddinCommand')(
    function terminateUiLessExtendedAddinCommand(
        controlId: string,
        hostItemIndex: string,
        status: InvokeAppAddinCommandStatusCode,
        context?: { allowEvent?: boolean }
    ) {
        resolvePendingUILess(controlId, {
            status,
            allowEvent: context?.allowEvent,
        });

        const runningUILessExtendedAddinCommands = getExtensibilityState()
            .runningUILessExtendedAddinCommands;
        if (runningUILessExtendedAddinCommands.has(hostItemIndex)) {
            runningUILessExtendedAddinCommands.get(hostItemIndex).delete(controlId);
            if (runningUILessExtendedAddinCommands.get(hostItemIndex).size === 0) {
                runningUILessExtendedAddinCommands.delete(hostItemIndex);
            }
        }
    }
);
