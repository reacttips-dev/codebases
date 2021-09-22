import { updateSelectedCalendarIdsInStore } from '../actions/internalActions';
import { onSelectedCalendarIdsUpdated, updateSelectedCalendarIds } from '../actions/publicActions';
import { getTimePanelSelectedCalendarIdsMap } from '../selectors/getSelectedCalendarIdsMap';
import { getSelectedCalendarsCountFromTimePanel } from '../selectors/getSelectedCalendarsCountFromTimePanel';
import { hasTimePanelSelectedCalendars } from '../selectors/hasTimePanelSelectedCalendars';
import { getDefaultCalendar } from 'owa-calendar-cache';
import {
    getSelectedCalendars as getSelectedCalendarsFromCalendarModule,
    getSelectedCalendarsCount as getSelectedCalendarsCountFromCalendarModule,
} from 'owa-calendar-module-selected-calendars-user-config';
import { getUserMailboxInfo } from 'owa-client-ids';
import { createExponentialBackoffFunction, createRetriableFunction } from 'owa-retriable-function';
import { updateTimePanelCalendarIdsService } from 'owa-scenario-settings';
import { dedupeArrayValues } from 'owa-selected-calendars-utils';
import { getPrimaryAndConnectedAccountsEmailAddresses } from 'owa-session-store';
import { trace } from 'owa-trace';
import { orchestrator } from 'satcheljs';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});

/** Ensure only one active request per account at a time */
let currentRequests: {
    [account: string]: { updateFunc: () => Promise<void>; cancel: () => void };
} = {};

export const updateSelectedCalendarIdsOrchestrator = orchestrator(
    updateSelectedCalendarIds,
    async actionMessage => {
        const { calendarIds, userIdentity } = actionMessage;

        // ignore primary account update if it will result in no calendars selected across all accounts
        if (
            getUserMailboxInfo().userIdentity === userIdentity &&
            getSelectedCalendarsCountFromTimePanel() === 1 &&
            getSelectedCalendarsCountFromTimePanel(userIdentity) === 1 &&
            calendarIds.length === 0
        ) {
            return;
        }

        // if first time using Time Panel calendar picker, first clone existing settings from Calendar module
        if (!hasTimePanelSelectedCalendars()) {
            await cloneSelectedCalendarIds();
        }

        // apply update to settings
        applyUpdateToSelectedCalendarIds(calendarIds, userIdentity);
    }
);

/**
 * Clones selected calendarIds config from Calendar module to Time Panel for all accounts
 *
 * Before the user tries Time Panel calendar picker, `TimePanelSelectedCalendarIdsStore` is undefined
 * and Calendar module config is referenced instead.
 *
 * When the user makes their first selection, the action should feel "seamless" from UX perspective
 * (although behind the scenes, the picker switches over to Time Panel config).
 *
 * In a single-account world, cloning is unnecessary as each call to `updateTimePanelCalendarIdsService` is
 * idempotent due to the full list of selected calendarIds provided to both the backend and frontend stores.
 *
 * Factor in the multi-account concern however -- the first user selection will populate the backend and
 * frontend stores with the Calendar module config setting **for the associated account**, but all other
 * accounts will still have an empty Time Panel config, which results in selections for the other accounts
 * randomly "disappearing" from the picker (and associated events disappearing from calendar view too).
 *
 * To handle this gracefully, the "clone" operation ensures that all accounts have their configs transferred,
 * not just the account associated with the first calendar selection change.
 *
 * To handle the case where the Calendar module config itself is empty (e.g. for new user who has never
 * made selections) across all accounts, each account's config is modified to auto-select the default
 * calendar as part of the "clone" operation.
 */
async function cloneSelectedCalendarIds(): Promise<void> {
    await Promise.all(
        getPrimaryAndConnectedAccountsEmailAddresses().map(userIdentity => {
            let config = getSelectedCalendarsFromCalendarModule().get(userIdentity) ?? [];

            if (getSelectedCalendarsCountFromCalendarModule() === 0) {
                const defaultCalendar = getDefaultCalendar(userIdentity);
                if (defaultCalendar) {
                    config = [defaultCalendar.calendarId.id];
                }
            }

            applyUpdateToSelectedCalendarIds(
                config,
                userIdentity,
                true /* skipUpdateSignal -- since cloning is a special update with no change from user perspective */
            );
        })
    );
}

const UPDATE_CALENDAR_IDS_DELAY_IN_MILLISECONDS = 1000;

/**
 * Applies an update to selected calendarIds config for a given account, including logical lie
 */
async function applyUpdateToSelectedCalendarIds(
    calendarIds: string[],
    userIdentity: string,
    skipUpdateSignal?: boolean
): Promise<void> {
    // cleanse data prior to save
    const updatedCalendarIds = dedupeArrayValues(calendarIds);

    // store reference to original IDs agnostically to backing config in case the local lie needs to be reverted
    const originalCalendarIds = getTimePanelSelectedCalendarIdsMap().get(userIdentity);

    try {
        // apply local lie
        updateSelectedCalendarIdsInStore(updatedCalendarIds, userIdentity);
        if (!skipUpdateSignal) {
            onSelectedCalendarIdsUpdated();
        }

        // if there is a request out to update calendar ids, cancel it
        currentRequests[userIdentity]?.cancel();

        let updateCalendarIdsRetriableFunc = createRetriableFunc(() =>
            updateTimePanelCalendarIdsService(updatedCalendarIds, userIdentity)
        );
        const delayedFunction = createDelayFunction(
            updateCalendarIdsRetriableFunc.retriableFunc,
            UPDATE_CALENDAR_IDS_DELAY_IN_MILLISECONDS
        );

        const request = {
            cancel: () => {
                // cancel the delayed function which triggers the retriable
                // request and cancel any future retries for existing retiable requests.
                delayedFunction.cancel();
                updateCalendarIdsRetriableFunc.cancel();
            },
            updateFunc: delayedFunction.delayFunc,
        };

        currentRequests[userIdentity] = request;
        await request.updateFunc();
    } catch (error) {
        trace.warn(
            `updateSelectedCalendarIdsOrchestrator: updateTimePanelCalendarIdsService with retry failed: ${error}`
        );
        // revert local lie
        updateSelectedCalendarIdsInStore(originalCalendarIds, userIdentity);
        if (!skipUpdateSignal) {
            onSelectedCalendarIdsUpdated();
        }
    } finally {
        // clean up request tracking
        delete currentRequests[userIdentity];
    }
}

interface DelayFunction<T> {
    delayFunc: () => Promise<T>;
    cancel: () => void;
}

function createDelayFunction<T>(
    funcToDelay: () => Promise<T>,
    milliseconds: number
): DelayFunction<T> {
    let isCancelled = false; // Variable to track if the retry was cancelled
    const cancel = () => (isCancelled = true);
    const delayTimer = (resolve, reject) => {
        setTimeout(() => {
            if (!isCancelled) {
                funcToDelay();
                return resolve();
            }
        }, milliseconds);
    };
    return {
        delayFunc: () => new Promise((resolve, reject) => delayTimer(resolve, reject)),
        cancel: cancel,
    };
}
