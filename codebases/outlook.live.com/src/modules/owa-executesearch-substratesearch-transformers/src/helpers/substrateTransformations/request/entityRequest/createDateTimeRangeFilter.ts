import type { FilterBase } from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type AndType from 'owa-service/lib/contract/And';
import type Constant from 'owa-service/lib/contract/Constant';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';
import type IsGreaterThanOrEqualTo from 'owa-service/lib/contract/IsGreaterThanOrEqualTo';
import type IsLessThanOrEqualTo from 'owa-service/lib/contract/IsLessThanOrEqualTo';
import type PropertyUri from 'owa-service/lib/contract/PropertyUri';
import type RestrictionType from 'owa-service/lib/contract/RestrictionType';
import { createDateTimeRangeFilter } from 'owa-search-service';

/**
 * Creates DateTime range filters from SearchRestrictions (in ExecuteSearch request).
 */
export function createDateTimeRangeFilterFromExecuteSearchRequest(
    request: ExecuteSearchJsonRequest
) {
    const rangeFilters: FilterBase[] = [];

    const bounds = parseDateTimeRangeSearchRestrictions(request.Body.SearchRestrictions);
    const { lteFieldValue, gteFieldValue } = bounds;
    let { lteFieldUri, gteFieldUri } = bounds;

    if (lteFieldValue && lteFieldUri && gteFieldValue && gteFieldUri) {
        lteFieldUri = convertFieldUriToRangeFilterName(lteFieldUri);
        gteFieldUri = convertFieldUriToRangeFilterName(gteFieldUri);

        return createDateTimeRangeFilter(lteFieldValue, gteFieldValue, lteFieldUri, gteFieldUri);
    }

    return rangeFilters;
}

function parseDateTimeRangeSearchRestrictions(searchRestrictions: RestrictionType) {
    let lteFieldValue: string = null;
    let lteFieldUri: string = null;
    let gteFieldValue: string = null;
    let gteFieldUri: string = null;

    if (searchRestrictions?.Item) {
        const expression = searchRestrictions.Item;

        if (expression.__type === 'And:#Exchange') {
            const andExpression = expression as AndType;

            if (andExpression.Items && andExpression.Items.length === 2) {
                if (andExpression.Items[0].__type === 'IsLessThanOrEqualTo:#Exchange') {
                    const lteExpression = andExpression.Items[0] as IsLessThanOrEqualTo;

                    if (
                        lteExpression.FieldURIOrConstant.Item.__type === 'Constant:#Exchange' &&
                        lteExpression.Item.__type === 'PropertyUri:#Exchange'
                    ) {
                        const constant = lteExpression.FieldURIOrConstant.Item as Constant;
                        const propertyUri = lteExpression.Item as PropertyUri;

                        lteFieldValue = constant.Value;
                        lteFieldUri = propertyUri.FieldURI;
                    }
                }

                if (andExpression.Items[1].__type === 'IsGreaterThanOrEqualTo:#Exchange') {
                    const gteExpression = andExpression.Items[1] as IsGreaterThanOrEqualTo;

                    if (
                        gteExpression.FieldURIOrConstant.Item.__type === 'Constant:#Exchange' &&
                        gteExpression.Item.__type === 'PropertyUri:#Exchange'
                    ) {
                        const constant = gteExpression.FieldURIOrConstant.Item as Constant;
                        const propertyUri = gteExpression.Item as PropertyUri;

                        gteFieldValue = constant.Value;
                        gteFieldUri = propertyUri.FieldURI;
                    }
                }
            }
        }
    }

    return {
        lteFieldValue,
        lteFieldUri,
        gteFieldValue,
        gteFieldUri,
    };
}

function convertFieldUriToRangeFilterName(fieldUri: string) {
    switch (fieldUri) {
        case 'StartTime':
            return 'StartTime';
        case 'EndTime':
            return 'EndTime';
        case 'DateTimeReceived':
        default:
            return 'received';
    }
}
