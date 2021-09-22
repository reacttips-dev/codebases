import { getStore } from '../store';
import { mutator } from 'satcheljs';
import { initializeOwaDateTimeStore } from '../actions/internalActions';
import { setTimeFormat } from '../actions';

mutator(initializeOwaDateTimeStore, ({ TimeFormat = '' }) => {
    getStore().TimeFormat = TimeFormat;
});

mutator(setTimeFormat, ({ timeFormat }) => {
    getStore().TimeFormat = timeFormat;
});
