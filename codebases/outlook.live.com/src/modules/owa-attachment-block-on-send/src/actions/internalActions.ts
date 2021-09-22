import { action } from 'satcheljs';
import type CheckPermissionStatus from '../store/schema/CheckPermissionStatus';

export const setTelemetryPendingPermissionState = action(
    'SET_PENDING_STATE',
    (composeId: string, checkPermissionStatus: CheckPermissionStatus) => ({
        composeId,
        checkPermissionStatus,
    })
);
