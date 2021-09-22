import { createStore } from 'satcheljs';

export default createStore('calendarAccountInitializationStateStore', {
    isAllCalendarAccountsAndCacheLoaded: false,
});
