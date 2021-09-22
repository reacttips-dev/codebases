import { trace } from 'owa-trace';
import {
    getAndUpdateActualFolderId,
    canUpdateCalendarFolderId,
} from '../selectors/calendarCacheSelectors';

export const updateFolderIdsIfNeeded = async (calendarIds: string[]) => {
    if (calendarIds) {
        await Promise.all(
            calendarIds
                .filter(canUpdateCalendarFolderId)
                .map(getAndUpdateActualFolderId)
                .map(promise => promise.catch(handleError))
        );
    }
};

// catch and log any thrown errors for debugging, then resolve an empty promise so that Promise.all can still succeed
function handleError(error: Error): Promise<void> {
    trace.warn(`Failed to update folderId:\n${error}`);
    return Promise.resolve();
}
