import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { MailFolderTableQuery, MailSortHelper, SortColumn } from 'owa-mail-list-store';
import type SortResults from 'owa-service/lib/contract/SortResults';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import sortResults from 'owa-service/lib/factory/sortResults';

/**
 * Gets the sortByResults property
 * @param tableQuery tableQuery of the conversation type table for which to get the sortBy property
 * @return sortByResults - a collection of the sort properties
 */
export default function getConversationSortByProperty(
    tableQuery: MailFolderTableQuery
): SortResults[] {
    const sortBy = tableQuery.sortBy;
    let primarySortPropertyUri;
    switch (tableQuery.sortBy.sortColumn) {
        case SortColumn.Date:
            if (shouldTableSortByRenewTime(tableQuery)) {
                primarySortPropertyUri = 'ConversationLastDeliveryOrRenewTime';
            }
            break;

        case SortColumn.From:
            primarySortPropertyUri = 'ConversationUniqueSenders';
            break;

        case SortColumn.Size:
            primarySortPropertyUri = 'ConversationSize';
            break;

        case SortColumn.Subject:
            primarySortPropertyUri = 'ConversationTopic';
            break;

        case SortColumn.Importance:
            primarySortPropertyUri = 'ConversationImportance';
            break;

        default:
            throw new Error(
                'getConversationSortByProperty: sort column is not supported ' + sortBy.sortColumn
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
        tableQuery.sortBy.sortColumn == SortColumn.Date
            ? tableQuery.sortBy.sortDirection
            : MailSortHelper.DESCENDING_SORT_DIR;

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
