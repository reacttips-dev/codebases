import type { ReadOnlyUserOptionsType } from 'owa-service/lib/ReadOnlyTypes';
import { action } from 'satcheljs';

export const initializeOwaDateTimeStore = action(
    'initializeOwaDateTimeStore',
    (
        options:
            | Pick<
                  ReadOnlyUserOptionsType,
                  'DateFormat' | 'TimeFormat' | 'TimeZone' | 'MailboxTimeZoneOffset'
              >
            | undefined
    ) => {
        options = options || {};
        return {
            DateFormat: options.DateFormat,
            TimeFormat: options.TimeFormat,
            TimeZone: options.TimeZone,
            MailboxTimeZoneOffset: options.MailboxTimeZoneOffset,
        };
    }
);
