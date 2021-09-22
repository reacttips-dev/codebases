/**
 * Helper function to aggregate numbers to be logged as custom data in
 * datapoint logging.
 * @param value The number to be aggregated
 * @param exactMatches Array of values to report back as a singular number (i.e. [0, 1, 2, 3, 4, 5])
 * @param buckets Array of values to serve as upper-end of buckets (i.e. [10, 15, 25, 50, 100])
 */
export default function getAggregationBucket(params: {
    value: number;
    exactMatches?: number[];
    buckets?: number[];
}): string {
    const { value, exactMatches = [0, 1, 2, 3, 4, 5], buckets = [10, 15, 25, 50, 100] } = params;

    // Validate params
    if (buckets.length === 0) {
        throw new Error('getAggregationBucket: buckets cannot be an empty array');
    }

    // Return "less than" bucket if value is less than the smallest exact match value
    if (exactMatches[0] && value < exactMatches[0]) {
        return `<${exactMatches[0]}`;
    }

    // Return exact match if value is included in the list
    if (exactMatches.includes(value)) {
        return `${value}`;
    }

    // Return bucket if value isn't included in exact matches list
    for (let i = 0; i < buckets.length; i++) {
        if (value <= buckets[i]) {
            return `${
                i > 0 ? buckets[i - 1] + 1 : exactMatches[exactMatches.length - 1] + 1 || '0'
            }-${buckets[i]}`;
        }
    }

    // Return "more than" bucket if value is greater than the largest bucket
    return `${buckets[buckets.length - 1] + 1}+`;
}
