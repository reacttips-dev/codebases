import type { ReadOnlyUserOptionsType } from 'owa-service/lib/ReadOnlyTypes';
import { updateOwaDateTimeStore } from './updateOwaDateTimeStore';

let initializationPromise: Promise<void>;

/**
 * Initializes the date time store with options and initializes time zones
 * @param options
 * @param shouldInitializeTimeZoneAnonymously
 */
export function initializeOwaDateTimeStore(
    options:
        | Pick<
              ReadOnlyUserOptionsType,
              'DateFormat' | 'TimeFormat' | 'TimeZone' | 'MailboxTimeZoneOffset'
          >
        | undefined,
    shouldInitializeTimeZoneAnonymously?: boolean
): Promise<void> {
    if (!initializationPromise) {
        initializationPromise = updateOwaDateTimeStore(
            options,
            shouldInitializeTimeZoneAnonymously
        );
    }
    return initializationPromise;
}
