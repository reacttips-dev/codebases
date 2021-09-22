import { mutator } from 'satcheljs';
import { setTelemetryPendingPermissionState } from '../actions/internalActions';
import { getStore } from '../store/store';
/**
 * This state reflect the pending state only when the blocking dialog is shown.
 * It won't change after the dialog dismissed for thr purpose of telemetry
 */

mutator(setTelemetryPendingPermissionState, ({ composeId, checkPermissionStatus }) => {
    getStore().BlockOnSendAttachments.set(composeId, {
        checkPermissionStatus,
    });
});
