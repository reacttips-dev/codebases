import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';
import { updateServiceConfig } from 'owa-service/lib/config';
import { initializeOwaDateTimeStore, updateOwaDateTimeStore } from 'owa-datetime-store';
import { initializeOwaObservableDateTime } from 'owa-observable-datetime';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Initialize the date time store (use in boot scenarios)
 * @param userConfig
 * @param shouldInitializeTimeZoneAnonymously
 */
export default function initializeDateTime(shouldInitializeTimeZoneAnonymously?: boolean) {
    const userOptions = getUserConfiguration()?.UserOptions;
    updateServiceConfig({ timezone: userOptions?.TimeZone });
    const promise = initializeOwaDateTimeStore(userOptions, shouldInitializeTimeZoneAnonymously);
    initializeOwaObservableDateTime();
    return promise;
}

/**
 * Update the date time store (use on user update )
 * @param userConfig
 */
export function updateDateTime(userConfig: OwaUserConfiguration) {
    const userOptions = userConfig?.UserOptions;
    updateServiceConfig({ timezone: userOptions?.TimeZone });
    updateOwaDateTimeStore(userOptions);
    initializeOwaObservableDateTime();
}
