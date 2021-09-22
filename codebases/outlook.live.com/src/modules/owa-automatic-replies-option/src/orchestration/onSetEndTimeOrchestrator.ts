import updateCalendarEventsToDecline from '../actions/updateCalendarEventsToDecline';
import setEndTime from '../actions/setEndTime';
import { orchestrator } from 'satcheljs';

export default orchestrator(setEndTime, ({ dateTime }) => {
    if (dateTime) {
        updateCalendarEventsToDecline();
    }
});
