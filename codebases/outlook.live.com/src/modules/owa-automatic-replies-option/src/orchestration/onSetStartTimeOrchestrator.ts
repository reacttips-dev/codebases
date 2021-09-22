import updateCalendarEventsToDecline from '../actions/updateCalendarEventsToDecline';
import setStartTime from '../actions/setStartTime';
import { orchestrator } from 'satcheljs';

export default orchestrator(setStartTime, ({ dateTime }) => {
    if (dateTime) {
        updateCalendarEventsToDecline();
    }
});
