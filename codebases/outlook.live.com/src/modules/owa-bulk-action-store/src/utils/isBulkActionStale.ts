import differenceInHours from 'date-fns/difference_in_hours';
import BulkActionStateEnum from '../store/schema/BulkActionStateEnum';
import { getStore } from '../store/store';
import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';

/**
 * @param newBulkActionInfomation the new bulk action info to validate
 *
 * This code is used to determine if the current state held in store has already terminated: in which
 * case we do not care to recieve new payloads for this folder.
 *
 * Additionally we check that new payloads are not stale (i.e. in a running state, but older than HOURS_STALE)
 * @returns a boolean asserting if new bulkActionState is stale or not
 */
export default function isBulkActionStale(
    newBulkActionInfomation: BulkActionInformation,
    folderId: string
): boolean {
    const HOURS_STALE = 7.5;
    const currentTime = new Date();
    const sendTime = new Date(newBulkActionInfomation.sendTime);
    const elapsedTime = differenceInHours(currentTime, sendTime);

    const isTimeInvalid = isNaN(elapsedTime);
    const isTimeStale = elapsedTime > HOURS_STALE;
    const priorProgress: BulkActionInformation = getStore().bulkActionInformationMap.get(folderId);

    // If time is malformed OR time is older than HOURS_STALE return stale.
    if (isTimeInvalid || isTimeStale) {
        return true;
    }

    // If no prior bulk action progress is found, and this payload is more recent than
    // HOURS_STALE, return NOT stale. This scenario may arise with refresh or boot
    // scenarios where the store is empty and we recieve a 'catchup' payload. Thus,
    // we must assume this payload is not stale.
    if (!priorProgress) {
        return false;
    }

    // At this point we know a previous bulkActionState exists, so we need to
    // ensure that it is not already terminated.
    const isAlreadyInTerminatingState =
        [
            BulkActionStateEnum.Cancelled,
            BulkActionStateEnum.Failed,
            BulkActionStateEnum.Complete,
        ].indexOf(priorProgress.state) > -1;

    return isAlreadyInTerminatingState;
}
