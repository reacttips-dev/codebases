import type { ReadOnlyUserOptionsType } from 'owa-service/lib/ReadOnlyTypes';
import { initializeOwaDateTimeStore as initializeOwaDateTimeStoreAction } from '../actions/internalActions';
import { initializeTimeZones } from './initializeTimeZones';

/**
 * Updates the date time store with options and time zones
 * @param options
 * @param shouldInitializeTimeZoneAnonymously
 */
export async function updateOwaDateTimeStore(
    options:
        | Pick<
              ReadOnlyUserOptionsType,
              'DateFormat' | 'TimeFormat' | 'TimeZone' | 'MailboxTimeZoneOffset'
          >
        | undefined,
    shouldInitializeTimeZoneAnonymously?: boolean
): Promise<void> {
    initializeOwaDateTimeStoreAction(options);

    return initializeTimeZones(shouldInitializeTimeZoneAnonymously);
}
