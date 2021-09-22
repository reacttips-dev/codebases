import { createStore } from 'satcheljs';

export default createStore('ObservableDateTime', {
    now: 0, // timestamp of 'now', updated every minute.
    today: 0, // timestamp of the start of 'today', in the user's time zone.
});
