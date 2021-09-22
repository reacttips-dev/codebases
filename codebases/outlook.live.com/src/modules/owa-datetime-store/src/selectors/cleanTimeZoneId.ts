import { getStore } from '../store';

export const CustomTimeZoneId = 'tzone://Microsoft/Custom';
export const UtcRuleId = 'tzrule://Microsoft/UtcRule';
export const UtcZoneId = 'tzone://Microsoft/Utc';

export default function cleanTimeZoneId(timeZoneId?: string): string {
    if (timeZoneId == CustomTimeZoneId) {
        return getStore().LocalTimeZone;
    } else if (timeZoneId == UtcRuleId || timeZoneId == UtcZoneId) {
        return 'UTC';
    }
    return timeZoneId || getStore().LocalTimeZone;
}
