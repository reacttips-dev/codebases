import {
    updateCalendarIdOrderedList,
    updateCalendarGroupKeyOrderedList,
} from '../actions/publicActions';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(updateCalendarIdOrderedList, ({ indexToUpdate, idToAdd }) => {
    if (idToAdd) {
        getStore().calendarIdOrderedList.splice(indexToUpdate, 0, idToAdd);
    } else {
        getStore().calendarIdOrderedList.splice(indexToUpdate, 1);
    }
});

mutator(updateCalendarGroupKeyOrderedList, ({ indexToUpdate, idToAdd }) => {
    if (idToAdd) {
        getStore().calendarGroupKeyOrderedList.splice(indexToUpdate, 0, idToAdd);
    } else {
        getStore().calendarGroupKeyOrderedList.splice(indexToUpdate, 1);
    }
});
