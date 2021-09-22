import {
    addMinutes,
    differenceInMilliseconds,
    getTimestamp,
    now,
    startOfMinute,
    today,
} from 'owa-datetime';
import {
    initializeOwaObservableDateTime,
    observableNowChanged,
    observableTodayChanged,
} from './actions';
import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';
import { orchestrator } from 'satcheljs';
import { setLocalTimeZone } from 'owa-datetime-store';
import { updateTimes, setNow, setToday } from './privateActions';
import getStore from './store';

/**
 * If the initialization is called from multiple sources, ensure the times are updated
 * immediately on each call but prevent reinitializing the interval and listeners that
 * already exist
 */
let hasInitializeOwaObservableDateTime = false;

orchestrator(initializeOwaObservableDateTime, () => {
    updateTimes();

    if (!hasInitializeOwaObservableDateTime) {
        const NOW = now();
        const startOfNextMinute = startOfMinute(addMinutes(NOW, 1));
        const msToNextMinute = differenceInMilliseconds(startOfNextMinute, NOW);

        setTimeout(() => setInterval(updateTimes, MILLISECONDS_IN_MINUTE), msToNextMinute);

        /**
         * If the tab loses visibility, the times will stop updating while in the background.
         * When the page restores focus, the next update will be up to 60s away, so we want
         * to have the time correct itself immediately instead of waiting
         */
        if (document) {
            document.addEventListener('visibilitychange', updateTimes);
        }
        hasInitializeOwaObservableDateTime = true;
    }
});

/** Recalculate 'today' when the time zone changes */
orchestrator(setLocalTimeZone, () => {
    updateTimes();
});

/**
 * Update the store with the timestamp of now and
 * the start of the current day in the current time zone,
 * then raise public events so orchestrators that depend
 * on these values can run.
 */
orchestrator(updateTimes, () => {
    setNow();

    const newToday = getTimestamp(today());
    const isNewDay = getStore().today != newToday;
    if (isNewDay) {
        setToday(newToday);
    }

    observableNowChanged();
    if (isNewDay) {
        observableTodayChanged();
    }
});
