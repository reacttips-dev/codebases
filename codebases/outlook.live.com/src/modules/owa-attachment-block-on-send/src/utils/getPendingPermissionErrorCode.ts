import CheckPermissionStatus from '../store/schema/CheckPermissionStatus';
import { assertNever } from 'owa-assert';
import { getPendingPermissionState } from '../selectors/getPendingPermissionState';

export function getPendingPermissionErrorCode(composeId: string): string {
    const checkPermissionStatus: CheckPermissionStatus = getPendingPermissionState(composeId);

    switch (checkPermissionStatus) {
        case CheckPermissionStatus.InProcess:
            return 'InProcess';
        case CheckPermissionStatus.NoAccess:
            return 'NoAccess';
        case CheckPermissionStatus.HasAccess:
            return 'HasAccess';
        default:
            assertNever(checkPermissionStatus);
    }
}
