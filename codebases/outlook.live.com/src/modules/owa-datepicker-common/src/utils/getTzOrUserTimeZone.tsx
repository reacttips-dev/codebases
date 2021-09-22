import { getUserTimeZone } from 'owa-session-store';
import type { OwaDate } from 'owa-datetime';

export default (value: OwaDate | null | undefined, timeZoneId?: string) =>
    value ? value.tz : timeZoneId || getUserTimeZone();
