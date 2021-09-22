import { getStore } from '../store';
import { mutator } from 'satcheljs';
import { setDateFormat } from '../actions';
import { initializeOwaDateTimeStore } from '../actions/internalActions';

mutator(initializeOwaDateTimeStore, ({ DateFormat = '' }) => {
    getStore().DateFormat = DateFormat;
});

mutator(setDateFormat, ({ dateFormat }) => {
    getStore().DateFormat = dateFormat;
});
