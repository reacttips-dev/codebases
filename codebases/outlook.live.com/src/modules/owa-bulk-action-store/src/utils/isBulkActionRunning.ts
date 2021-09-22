import { isBulkActionInState, BulkActionStateEnum, isBulkActionValid } from '../index';

export default function isBulkActionRunning(folderId: string): boolean {
    return (
        (isBulkActionInState(folderId, BulkActionStateEnum.Uninitialized) ||
            isBulkActionInState(folderId, BulkActionStateEnum.Running)) &&
        isBulkActionValid(folderId)
    );
}
