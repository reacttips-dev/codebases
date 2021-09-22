import { getStore } from '../store';
import { mutator } from 'satcheljs';
import { setLocalTimeZone } from '../actions';
import { initializeOwaDateTimeStore } from '../actions/internalActions';

mutator(initializeOwaDateTimeStore, ({ TimeZone = '' }) => {
    getStore().LocalTimeZone = TimeZone;
});

mutator(setLocalTimeZone, ({ timeZone }) => {
    getStore().LocalTimeZone = timeZone || '';
});
