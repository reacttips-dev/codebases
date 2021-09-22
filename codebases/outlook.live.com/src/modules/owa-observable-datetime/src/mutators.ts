import { mutator } from 'satcheljs';
import { setNow, setToday } from './privateActions';
import { timestamp } from 'owa-datetime';
import getStore from './store';

mutator(setNow, () => {
    getStore().now = timestamp();
});

mutator(setToday, ({ today }) => {
    getStore().today = today;
});
