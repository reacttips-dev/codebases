import type RestrictionType from 'owa-service/lib/contract/RestrictionType';
import type SearchExpressionType from 'owa-service/lib/contract/SearchExpressionType';
import andType from 'owa-service/lib/factory/and';
import constantType from 'owa-service/lib/factory/constant';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import isGreaterOrEqualType from 'owa-service/lib/factory/isGreaterThanOrEqualTo';
import isLessOrEqualType from 'owa-service/lib/factory/isLessThanOrEqualTo';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import restrictionType from 'owa-service/lib/factory/restrictionType';
import { OwaDate, MIN_OUTLOOK_DATE, MAX_OUTLOOK_DATE, getISODateString } from 'owa-datetime';

const defaultFieldUri = 'DateTimeReceived';
/**
 * Gets date search restrictions for search request
 */
export default function getSearchRestrictions(
    fromDate: OwaDate,
    toDate: OwaDate,
    upperBoundFieldUri: string,
    lowerBoundFieldUri: string
): RestrictionType {
    if (fromDate || toDate) {
        const searchExpressions: SearchExpressionType[] = [];

        /**
         * Generates the "before date" expression. If toDate is falsey, meaning
         * that the user only selected an "after date", default the "before date" value
         * to MAX_OUTLOOK_DATE.
         */
        searchExpressions.push(
            isLessOrEqualType({
                FieldURIOrConstant: fieldURIOrConstantType({
                    Item: constantType({
                        Value: getISODateString(toDate || MAX_OUTLOOK_DATE),
                    }),
                }),
                Item: propertyUri({
                    FieldURI: upperBoundFieldUri ? upperBoundFieldUri : defaultFieldUri,
                }),
            })
        );

        /**
         * Generates the "after date" expression. If fromDate is falsey, meaning
         * that the user only selected a "before date", default the "after date" value
         * to MIN_OUTLOOK_DATE.
         */
        searchExpressions.push(
            isGreaterOrEqualType({
                FieldURIOrConstant: fieldURIOrConstantType({
                    Item: constantType({
                        Value: getISODateString(fromDate || MIN_OUTLOOK_DATE),
                    }),
                }),
                Item: propertyUri({
                    FieldURI: lowerBoundFieldUri ? lowerBoundFieldUri : defaultFieldUri,
                }),
            })
        );

        const restrictions = andType({
            Items: searchExpressions,
        });

        return restrictionType({
            Item: restrictions,
        });
    } else {
        return null;
    }
}
