import { logUsage } from 'owa-analytics';
import { orchestrator } from 'satcheljs';
import { userDate } from 'owa-datetime';
import getRemindersService from '../services/getReminders';
import scheduleTimerForWebPushReminder from '../services/scheduleTimerForWebPushReminder';
import getTimeToNextRefresh from '../utils/getTimeToNextRefresh';
import pushActiveRemindersAndSetTimeout from './pushActiveRemindersAndSetTimeout';
import refreshReminders from '../actions/refreshReminders';
import setReminders from '../mutators/setReminders';
import throttle from 'lodash-es/throttle';
import getRemindersForAccount from '../selectors/getRemindersForAccount';
import { MIN_MINUTES_PAST, MAX_MINUTES_FUTURE } from '../utils/ReminderWindowConstants';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isReminderWebPushLocallyEnabled } from 'owa-webpush-notifications';

export const RETRY_BACKOFF_FACTOR = 2;
export const MAX_RETRY_DELAY = 5 * 60 * 1000; // 5 minutes
export const MIN_RETRY_DELAY = 30 * 1000; //30 seconds

interface ReminderRefreshProps {
    timerId: number | null;
    inRefresh: boolean;
    throttledFunctionForRefresh: () => void;
}

let retryCount = 0;
let refreshPropsMap = new Map<string | null, ReminderRefreshProps>();

/** Exported for test case */
export async function onUpdateReminderData(userIdentity: string | null) {
    // We only fetch ${MAX_MINUTES_FUTURE} minutes of reminder data,
    // so we need to keep a time to refresh the data
    // we do this per account
    const refreshProps = getRefreshPropsForAccount(userIdentity);

    const inRefreshFlag = refreshProps.inRefresh;
    logUsage('refreshReminders', { inRefreshFlag, retryCount }, { sessionSampleRate: 10 });

    if (refreshProps.inRefresh) {
        // If a reminder notification comes in while we're in the middle of a service call
        // to fetch the new reminder data, it can spawn off a new reminder loop.
        // We have this "semaphore" to prevent that.
        return;
    }
    refreshProps.inRefresh = true;

    if (refreshProps.timerId) {
        clearTimeout(refreshProps.timerId);
        refreshProps.timerId = 0;
    }

    let refreshTime = MIN_RETRY_DELAY;
    let error: string | null = null;
    let remindersResponseCount = 0;

    try {
        const remindersResponse = await getRemindersService(
            userIdentity,
            MIN_MINUTES_PAST,
            MAX_MINUTES_FUTURE
        );

        const newReminders = remindersResponse?.Reminders ? remindersResponse.Reminders : [];
        remindersResponseCount = newReminders.length;

        const newParsedReminders = newReminders.map(reminder => ({
            ...reminder,
            parsedStartDate: userDate(reminder.StartDate),
            parsedEndDate: userDate(reminder.EndDate),
            parsedReminderTime: userDate(reminder.ReminderTime),
            userIdentity: userIdentity,
        }));

        setReminders(userIdentity, newParsedReminders);
        pushActiveRemindersAndSetTimeout(userIdentity);

        if (
            isFeatureEnabled('auth-scheduleTimerForReminderWebPush') &&
            isReminderWebPushLocallyEnabled()
        ) {
            scheduleTimerForWebPushReminder(newParsedReminders);
        }
        const remindersForAccount = getRemindersForAccount(userIdentity);
        refreshTime = remindersForAccount
            ? getTimeToNextRefresh(remindersForAccount)
            : getTimeToNextRefresh([]);
        retryCount = 0;
    } catch (err) {
        error = 'Error:' + err;
        const retryDelay = Math.pow(RETRY_BACKOFF_FACTOR, retryCount++) * MIN_RETRY_DELAY;
        refreshTime = Math.min(retryDelay, MAX_RETRY_DELAY);
    } finally {
        logUsage(
            'refreshReminders/setTimeout',
            {
                remindersResponseCount,
                refreshTime,
                error,
                retryCount,
            },
            { sessionSampleRate: 10 }
        );
        refreshProps.timerId = window.setTimeout(refreshReminders, refreshTime, userIdentity);
        refreshProps.inRefresh = false;
    }
}

// It is possible for RefreshReminder notifications to be firing in sequence with enough
// time in between them for us to fetch reminders and complete the call above, possibly
// causing a flood. In such cases the 'inRefresh' flag above will not stop the calls and
// the timeout loops keep getting reset. By client-throttling the call we prevent the flood.
orchestrator(refreshReminders, ({ userIdentity }) => {
    const refreshProps = getRefreshPropsForAccount(userIdentity);
    refreshProps.throttledFunctionForRefresh();
});

function getRefreshPropsForAccount(userIdentity: string | null): ReminderRefreshProps {
    let refreshPropsForAccount = refreshPropsMap.get(userIdentity);
    if (!refreshPropsForAccount) {
        refreshPropsForAccount = {
            timerId: null,
            inRefresh: false,
            throttledFunctionForRefresh: throttle(
                () => onUpdateReminderData(userIdentity),
                MIN_RETRY_DELAY,
                {
                    leading: true,
                    trailing: true,
                }
            ),
        };
        refreshPropsMap.set(userIdentity, refreshPropsForAccount);
    }

    return refreshPropsForAccount;
}
