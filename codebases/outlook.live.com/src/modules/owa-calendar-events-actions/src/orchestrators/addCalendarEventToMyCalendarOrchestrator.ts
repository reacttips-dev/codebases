import addCalendarEventToMyCalendarService from '../services/addCalendarEventToMyCalendarService';
import { addCalendarEventToMyCalendar } from '../actions/publicActions';
import { orchestrator } from 'satcheljs';

orchestrator(addCalendarEventToMyCalendar, async actionMessage => {
    const { itemId, addSeries } = actionMessage;
    await addCalendarEventToMyCalendarService(itemId, addSeries);
});
