import type { SortByInput } from 'owa-graph-schema';
import type SortResults from 'owa-service/lib/contract/SortResults';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import sortResults from 'owa-service/lib/factory/sortResults';

export function getConversationSortResultsFromSortBy(sortBy: SortByInput): SortResults[] {
    let primarySortPropertyUri;

    switch (sortBy.sortColumn) {
        case 'Date':
            if (sortBy.canSortByRenewTime) {
                primarySortPropertyUri = 'ConversationLastDeliveryOrRenewTime';
            }
            break;

        case 'From':
            primarySortPropertyUri = 'ConversationUniqueSenders';
            break;

        case 'Size':
            primarySortPropertyUri = 'ConversationSize';
            break;

        case 'Subject':
            primarySortPropertyUri = 'ConversationTopic';
            break;

        case 'Importance':
            primarySortPropertyUri = 'ConversationImportance';
            break;

        default:
            throw new Error(
                'getConversationSortResultsFromSortBy: sort column is not supported ' +
                    sortBy.sortColumn
            );
    }

    // Add primary SortResult
    const sortByResults: SortResults[] = [];
    if (primarySortPropertyUri) {
        sortByResults.push(
            sortResults({
                Order: sortBy.sortDirection,
                Path: propertyUri({ FieldURI: primarySortPropertyUri }),
            })
        );
    }

    // For non-date sorts the secondary sort direction will always default to descending.
    // For date sort we want to honour users selection of direction
    const secondarySortDirection =
        sortBy.sortColumn == 'Date' ? sortBy.sortDirection : 'Descending';

    // Add secondary SortResult of ConversationLastDeliveryTime for all sort types.
    // Currently only descending sort order is supported
    sortByResults.push(
        sortResults({
            Order: secondarySortDirection,
            Path: propertyUri({ FieldURI: 'ConversationLastDeliveryTime' }),
        })
    );

    return sortByResults;
}
