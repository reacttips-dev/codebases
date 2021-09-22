import getStore from '../store/store';
import { mutator } from 'satcheljs';
import { addToLoadedCalendarAccounts } from '../actions/internalActions';

mutator(addToLoadedCalendarAccounts, actionMessage => {
    getStore().loadedCalendarAccounts.push(actionMessage.calendarAccountData);
});
