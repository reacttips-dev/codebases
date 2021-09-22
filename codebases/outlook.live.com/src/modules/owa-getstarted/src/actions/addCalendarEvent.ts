import { action } from 'satcheljs';
import { task_First_Day_Of_Class_Event } from '../getStarted.locstring.json';
import loc from 'owa-localize';

export let addCalendarEvent = action('ADD_FIRST_EVENT', () => ({
    taskNewEventTitle: loc(task_First_Day_Of_Class_Event),
}));
