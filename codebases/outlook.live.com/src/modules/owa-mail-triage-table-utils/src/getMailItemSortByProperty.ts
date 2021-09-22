import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { MailFolderTableQuery, MailSortHelper, SortColumn } from 'owa-mail-list-store';
import type SortResults from 'owa-service/lib/contract/SortResults';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import sortResults from 'owa-service/lib/factory/sortResults';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

/**
 * Gets the sortBy property depending on the folder
 * @param tableQuery tableQuery of the conversation type table for which to get the sortBy property
 * @return sortBy - a collection of the sort properties
 */
export default function getMailItemSortByProperty(tableQuery: MailFolderTableQuery): SortResults[] {
    const sortBy = tableQuery.sortBy;
    let primarySortPropertyUri;
    let isExtendedPropertyUri;
    switch (sortBy.sortColumn) {
        case SortColumn.Date:
            if (shouldTableSortByRenewTime(tableQuery)) {
                // When table supports sorting by renew time,
                // ReceivedOrRenewTime is used as primary sort
                primarySortPropertyUri = 'ReceivedOrRenewTime';
            } else if (folderNameToId('drafts') == tableQuery.folderId) {
                // use LastModifiedTime as the primary sort for Drafts folder.
                primarySortPropertyUri = 'ItemLastModifiedTime';
            }
            break;

        case SortColumn.From:
            isExtendedPropertyUri = true;
            // Use the display name for sort column From and not the smtp address
            primarySortPropertyUri = extendedPropertyUri({
                PropertyTag: '0x0042',
                PropertyType: 'String',
            });
            break;

        case SortColumn.Size:
            primarySortPropertyUri = 'Size';
            break;

        case SortColumn.Importance:
            primarySortPropertyUri = 'Importance';
            break;

        case SortColumn.Subject:
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
        tableQuery.sortBy.sortColumn == SortColumn.Date
            ? tableQuery.sortBy.sortDirection
            : MailSortHelper.DESCENDING_SORT_DIR;

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
