import type TimeZoneRangeType from 'owa-service/lib/contract/TimeZoneRangeType';
import getTimeZoneOffsets from 'owa-timezone-loader/lib/getTimeZoneOffsets';
import getTimeZoneOperation from 'owa-service/lib/operation/getTimeZoneOperation';
import { updateAllTimeZones } from '../mutators/allTimeZonesMutators';
import { setTimeZoneRange } from '../mutators/timeZoneRangesMutators';

// TODO VSO 83431: seperate timezone logic out of owa-datetime-store
export async function initializeTimeZones(
    shouldInitializeTimeZoneAnonymously?: boolean
): Promise<void> {
    const timeZoneOffsetsPromise = initializeTimeZoneOffsets(shouldInitializeTimeZoneAnonymously);
    const allTimeZonesPromise = initializeAllTimeZones(shouldInitializeTimeZoneAnonymously);
    await Promise.all([timeZoneOffsetsPromise, allTimeZonesPromise]);
}

async function initializeAllTimeZones(
    shouldInitializeTimeZoneAnonymously?: boolean
): Promise<void> {
    var TimeZoneList =
        (shouldInitializeTimeZoneAnonymously && []) ||
        (await getTimeZoneOperation({ needTimeZoneList: true })).TimeZoneList;
    updateAllTimeZones(TimeZoneList as Required<TimeZoneRangeType>[]);
}

async function initializeTimeZoneOffsets(
    shouldInitializeTimeZoneAnonymously?: boolean
): Promise<void> {
    if (typeof shouldInitializeTimeZoneAnonymously !== 'undefined') {
        await getTimeZoneOffsets(shouldInitializeTimeZoneAnonymously).then(timeZoneOffsets => {
            const TimeZones = timeZoneOffsets || [];
            for (const { TimeZoneId, OffsetRanges, IanaTimeZones } of TimeZones) {
                setTimeZoneRange(
                    TimeZoneId!,
                    OffsetRanges as Required<TimeZoneRangeType>[],
                    IanaTimeZones || []
                );
            }
        });
    }
}
