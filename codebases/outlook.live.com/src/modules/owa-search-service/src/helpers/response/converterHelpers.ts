import type SubstrateSearchRequest from '../../data/schema/SubstrateSearchRequest';
import type {
    SearchResultSet,
    SearchResultFlagType,
    SearchResultFolderId,
    SearchResultItemId,
    SearchResultRecipient,
} from '../../data/schema/SubstrateSearchResponse';
import type ExecuteSearchSortOrder from 'owa-service/lib/contract/ExecuteSearchSortOrder';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type { FolderId } from 'owa-graph-schema';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';

export function convertToNormalizedSubject(subject: string): string {
    const MAX_COLON_INDEX = 6;

    if (!subject) {
        return subject;
    }

    const colonIndex = subject.indexOf(':');

    /**
     * We don't look at what the prefix text is, just that a colon is in the subject
     * and it's not "too far" from the start of the string.
     */
    if (colonIndex > 0 && colonIndex < MAX_COLON_INDEX && colonIndex + 1 < subject.length) {
        return subject.substring(colonIndex + 1).trim();
    }

    return subject;
}

export function convertToItemId(id: SearchResultItemId): ItemId {
    if (id) {
        return {
            Id: id.Id,
            ChangeKey: null,
        };
    }

    return null;
}

export function convertUtcDateTimeToRequestTimeZone(
    utcDateTimeString: string,
    request: SubstrateSearchRequest
): string {
    let convertedDateTimeString = null;

    if (request?.TimeZone) {
        const utcDateTime = new Date(utcDateTimeString);
        convertedDateTimeString = utcDateTime.toISOString();
    }

    return convertedDateTimeString;
}

export function convertToFlagType(flag: SearchResultFlagType): FlagType {
    if (!flag) {
        return null;
    }

    return {
        FlagStatus: flag.FlagStatus,
        CompleteDate: flag.CompleteDate,
        DueDate: flag.DueDate,
        StartDate: flag.StartDate,
    };
}

export function convertRecipientToSingleRecipientType(
    recipient: SearchResultRecipient
): SingleRecipientType {
    if (recipient?.EmailAddress) {
        return {
            Mailbox: {
                EmailAddress: recipient.EmailAddress.Address,
                Name: recipient.EmailAddress.Name,
                RoutingType: 'SMTP',
            },
        };
    }

    return null;
}

export function convertToFolderId(id: SearchResultFolderId): FolderId {
    if (id) {
        return {
            __typename: 'FolderId',
            Id: id.Id,
        };
    }

    return null;
}

export function convertSearchSortOrder(source: string): ExecuteSearchSortOrder {
    switch (source) {
        case 'DateTime':
            return 'DateTime';
        case 'Hybrid':
            return 'Hybrid';
        case 'Relevance':
            return 'Relevance';
        default:
            return null;
    }
}

export function convertToItemIds(ids: SearchResultItemId[]): ItemId[] {
    if (ids === null || ids.length === 0) {
        return null;
    }

    const convertedIds: ItemId[] = [];

    for (let i = 0; i < ids.length; i++) {
        convertedIds[i] = convertToItemId(ids[i]);
    }

    return convertedIds;
}

export function convertSearchQueryId(resultSet: SearchResultSet) {
    if (resultSet?.QueryId?.Id) {
        return {
            Id: resultSet.QueryId.Id,
        };
    }

    return null;
}
