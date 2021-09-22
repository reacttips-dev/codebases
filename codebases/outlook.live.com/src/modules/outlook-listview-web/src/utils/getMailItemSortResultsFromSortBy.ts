import type { SortByInput } from 'owa-graph-schema';
import type SortResults from 'owa-service/lib/contract/SortResults';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import sortResults from 'owa-service/lib/factory/sortResults';
import type SortDirection from 'owa-service/lib/contract/SortDirection';

const DESCENDING_SORT_DIR: SortDirection = 'Descending';

export function getMailItemSortResultsFromSortBy(sortBy: SortByInput): SortResults[] {
    let primarySortPropertyUri;
    let isExtendedPropertyUri;
    switch (sortBy.sortColumn) {
        case 'Date':
            if (sortBy.canSortByRenewTime) {
                // When table supports sorting by renew time,
                // ReceivedOrRenewTime is used as primary sort
                primarySortPropertyUri = 'ReceivedOrRenewTime';
            } else if (sortBy.isDraftsFolder) {
                // use LastModifiedTime as the primary sort for Drafts folder.
                primarySortPropertyUri = 'ItemLastModifiedTime';
            }
            break;

        case 'From':
            isExtendedPropertyUri = true;
            // Use the display name for sort column From and not the smtp address
            primarySortPropertyUri = extendedPropertyUri({
                PropertyTag: '0x0042',
                PropertyType: 'String',
            });
            break;

        case 'Size':
            primarySortPropertyUri = 'Size';
            break;

        case 'Importance':
            primarySortPropertyUri = 'Importance';
            break;

        case 'Subject':
            primarySortPropertyUri = 'Subject';
            break;

        default:
            throw new Error(
                'getMailItemSortByProperty: sort column not supported' + sortBy.sortColumn
            );
    }

    // Add primary SortResult
    const sortByResults: SortResults[] = [];
    if (primarySortPropertyUri) {
        let propertyUriPath = primarySortPropertyUri;
        if (!isExtendedPropertyUri) {
            propertyUriPath = propertyUri({ FieldURI: primarySortPropertyUri });
        }
        sortByResults.push(
            sortResults({
                Order: sortBy.sortDirection,
                Path: propertyUriPath,
            })
        );
    }

    // For non-date sorts the secondary sort direction will always default to descending.
    // For date sort we want to honour users selection of direction
    const secondarySortDirection =
        sortBy.sortColumn == 'Date' ? sortBy.sortDirection : DESCENDING_SORT_DIR;

    // Add secondary SortResult of DateTimeReceived for all sort types.
    // Currently only descending sort order is supported
    sortByResults.push(
        sortResults({
            Order: secondarySortDirection,
            Path: propertyUri({ FieldURI: 'DateTimeReceived' }),
        })
    );
    return sortByResults;
}
