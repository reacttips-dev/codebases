import { toJS } from 'mobx';
import { getStore } from '../store';

/**
 * Retrieves time zone offsets for the default time zone
 */
export default function getDefaultTimeZoneOffsets() {
    const { TimeZoneRanges, LocalTimeZone } = getStore();
    return toJS(TimeZoneRanges[LocalTimeZone] || []);
}
