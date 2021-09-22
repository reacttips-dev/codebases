import type { CalendarGroup } from 'owa-graph-schema';
import getCalendarGroupKey from '../utils/getCalendarGroupKey';
import getStore from '../store/store';
import { mutator } from 'satcheljs';
import { updateCalendarGroup } from '../actions/publicActions';

mutator(updateCalendarGroup, actionMessage => {
    const { groupId, userIdentity, calendarGroup } = actionMessage;

    const store = getStore();
    const groupKey = getCalendarGroupKey(userIdentity, groupId);

    const calendarGroupInStore: CalendarGroup = store.calendarGroupsMapping.get(groupKey);
    const { calendarGroupId, ...calendarGroupWithoutItemId } = calendarGroup;

    if (calendarGroupInStore) {
        Object.keys(calendarGroupWithoutItemId).forEach(property => {
            calendarGroupInStore[property] = calendarGroupWithoutItemId[property];
        });
    }
});
