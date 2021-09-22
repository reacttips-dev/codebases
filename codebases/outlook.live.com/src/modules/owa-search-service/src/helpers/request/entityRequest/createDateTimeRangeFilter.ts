import type { FilterBase, RangeFilter } from '../../../data/schema/SubstrateSearchRequest';

/**
 * Creates DateTime range filters from SearchRestrictions (in ExecuteSearch request).
 */
export default function createDateTimeRangeFilter(
    lteFieldValue: string,
    gteFieldValue: string,
    lteFieldUri: string,
    gteFieldUri: string
) {
    const rangeFilters: FilterBase[] = [];

    if (gteFieldUri === lteFieldUri) {
        /**
         * For Mail, the LTE and GTE range bounds are passed with "received"
         * range filter.
         */
        const rangeFilter: RangeFilter = {
            Range: {
                [gteFieldUri]: {
                    gte: gteFieldValue,
                    lte: lteFieldValue,
                },
            },
        };

        rangeFilters.push(rangeFilter);
    } else {
        /**
         * For Calendar, the LTE and GTE range bounds are passed with
         * "startTime" and "endTime" range filters.
         */
        const gteRangeFilter: RangeFilter = {
            Range: {
                [gteFieldUri]: {
                    gte: gteFieldValue,
                },
            },
        };
        rangeFilters.push(gteRangeFilter);

        const lteRangeFilter: RangeFilter = {
            Range: {
                [lteFieldUri]: {
                    lte: lteFieldValue,
                },
            },
        };
        rangeFilters.push(lteRangeFilter);
    }

    return rangeFilters;
}
