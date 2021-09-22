import type BulkActionStateEnum from '../store/schema/BulkActionStateEnum';
import store from '../store/store';
import isBulkActionValid from './isBulkActionValid';

/**
 * If bulkActionState exists and is equal to the state passed in return true.
 * If bulkActionState does not exist or is in another state return false.
 * @param folderId The target folder id
 * @param bulkActionState The state to check that the bulk action is in
 */
export default function isBulkActionInState(
    folderId: string,
    bulkActionState: BulkActionStateEnum
) {
    const bulkActionInfo = store.bulkActionInformationMap.get(folderId);

    return isBulkActionValid(folderId) && bulkActionInfo.state == bulkActionState;
}
