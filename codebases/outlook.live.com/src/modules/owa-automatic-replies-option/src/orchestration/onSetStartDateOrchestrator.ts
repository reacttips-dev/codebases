import updateCalendarEventsToDecline from '../actions/updateCalendarEventsToDecline';
import setStartDate from '../actions/setStartDate';
import { orchestrator } from 'satcheljs';

export default orchestrator(setStartDate, ({ date }) => {
    if (date) {
        updateCalendarEventsToDecline();
    }
});
