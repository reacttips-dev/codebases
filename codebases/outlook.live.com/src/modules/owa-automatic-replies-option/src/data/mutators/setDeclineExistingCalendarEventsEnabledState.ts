import getStore from '../store/store';
import { mutator } from 'satcheljs';
import setDeclineExistingCalendarEvents from '../../actions/setDeclineExistingCalendarEvents';

export default mutator(setDeclineExistingCalendarEvents, actionMessage => {
    let optionState = getStore().currentState;
    optionState.declineExistingCalendarEventsEnabled = actionMessage.option;
});
