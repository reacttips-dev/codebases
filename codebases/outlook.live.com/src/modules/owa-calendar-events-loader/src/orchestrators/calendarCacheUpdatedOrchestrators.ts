import { orchestrator } from 'satcheljs';
import { calendarCacheInitializedForAccount } from 'owa-calendar-cache-loader';
import { calendarFolderIdUpdated } from 'owa-calendarsapi-outlook';
import { tryLoadingCalendarIdsToBeLoaded } from '../utils/tryLoadingCalendarIdsToBeLoaded';

export const calendarCacheInitializedForAccountOrchestrator = orchestrator(
    calendarCacheInitializedForAccount,
    tryLoadingCalendarIdsToBeLoaded
);

export const folderIdsUpdatedOrchestrator = orchestrator(
    calendarFolderIdUpdated,
    tryLoadingCalendarIdsToBeLoaded
);
