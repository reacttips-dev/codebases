/**
 * For datapoint aggregation in azure we can only have 24 unique possible values for any custom data key.
 *
 * @param value - value that needs to be log
 * @param shouldAccountForZero - If true then account for 0, bucket all values >=23 as "23" otherwise bucket all values >=24 as "24".
 */
const truncateCountForDataPointAggregation = (
    value: number,
    shouldAccountForZero: boolean = true
): number => {
    const MAX_VALUE_ALLOWED: number = 24;
    const MAX_VALUE_ALLOWED_ACCOUNTING_ZERO: number = 23;
    const maximumUniqueValueAllowed: number = shouldAccountForZero
        ? MAX_VALUE_ALLOWED_ACCOUNTING_ZERO
        : MAX_VALUE_ALLOWED;

    return value >= maximumUniqueValueAllowed ? maximumUniqueValueAllowed : value;
};

export default truncateCountForDataPointAggregation;
