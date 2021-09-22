import { updateSelectedCalendarIdsInStore } from '../actions/internalActions';
import { getStore } from '../store/store';
import { dedupeArrayValues } from 'owa-selected-calendars-utils';
import { mutator } from 'satcheljs';

export const updateSelectedCalendarIdsInStoreMutator = mutator(
    updateSelectedCalendarIdsInStore,
    actionMessage => {
        const { calendarIds, userIdentity } = actionMessage;
        getStore().calendarIdsMap.set(userIdentity, dedupeArrayValues(calendarIds));
    }
);
