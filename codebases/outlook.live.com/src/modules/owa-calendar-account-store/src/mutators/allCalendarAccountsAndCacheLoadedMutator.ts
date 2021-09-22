import getStore from '../store/store';
import { mutator } from 'satcheljs';
import { allCalendarAccountsAndCacheLoaded } from '../actions/publicActions';

mutator(allCalendarAccountsAndCacheLoaded, actionMessage => {
    if (actionMessage.isSuccess) {
        getStore().isAllCalendarAccountsAndCacheLoaded = true;
    }
});
