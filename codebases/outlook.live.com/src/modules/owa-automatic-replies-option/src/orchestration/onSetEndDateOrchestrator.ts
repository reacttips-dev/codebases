import updateCalendarEventsToDecline from '../actions/updateCalendarEventsToDecline';
import setEndDate from '../actions/setEndDate';
import { orchestrator } from 'satcheljs';

export default orchestrator(setEndDate, ({ date }) => {
    if (date) {
        updateCalendarEventsToDecline();
    }
});
