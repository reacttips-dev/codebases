import updateCalendarEventsToDecline from '../actions/updateCalendarEventsToDecline';
import setDeclineExistingCalendarEvents from '../actions/setDeclineExistingCalendarEvents';
import { orchestrator } from 'satcheljs';

export default orchestrator(setDeclineExistingCalendarEvents, () => {
    updateCalendarEventsToDecline();
});
