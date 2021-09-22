import type {
    SortByInput,
    ViewFilter,
    FocusedViewFilter,
    MailboxInfoInput,
    ConversationRowPropertiesToRequestInput,
} from 'owa-graph-schema';
import type BasePagingType from 'owa-service/lib/contract/BasePagingType';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import folderId from 'owa-service/lib/factory/folderId';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import { getFindConversationTraversal } from '../utils/getFindConversationTraversal';
import type FindConversationRequest from 'owa-service/lib/contract/FindConversationRequest';
import { convertToOwsFocusedViewFilter } from '../utils/convertToOwsFocusedViewFilter';
import { getConversationResponseShape } from '../utils/getConversationResponseShape';
import { getConversationSortResultsFromSortBy } from '../utils/getConversationSortResultsFromSortBy';
import findConversationOperation from 'owa-service/lib/operation/findConversationOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type RestrictionType from 'owa-service/lib/contract/RestrictionType';
import type FindConversationJsonResponse from 'owa-service/lib/contract/FindConversationJsonResponse';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export function findConversation(
    folderIdToFetch: string,
    paging: BasePagingType,
    viewFilter: ViewFilter,
    sortBy: SortByInput,
    focusedViewFilter: FocusedViewFilter,
    shape: ConversationRowPropertiesToRequestInput,
    mailboxInfo: MailboxInfoInput,
    categoryName: string | null | undefined,
    searchFolderId: string | null | undefined,
    restriction?: RestrictionType,
    refinerRestriction?: RestrictionType,
    requestOptions?: RequestOptions
): Promise<FindConversationJsonResponse> {
    const mailboxRequestOptions = getMailboxRequestOptions(mailboxInfo, requestOptions);

    let baseFolderId;
    if (mailboxInfo.type == 'GroupMailbox') {
        baseFolderId = distinguishedFolderId({
            Id: 'inbox',
            Mailbox: {
                MailboxType: mailboxInfo.type,
                EmailAddress: mailboxInfo.mailboxSmtpAddress ?? undefined,
            },
        });
    } else {
        baseFolderId = folderId({ Id: folderIdToFetch });
    }

    const responseShape = getConversationResponseShape(shape.IsScheduledFolder);
    const sortResults = getConversationSortResultsFromSortBy(sortBy);

    const requestBody: FindConversationRequest = {
        ParentFolderId: targetFolderId({ BaseFolderId: baseFolderId }),
        ConversationShape: responseShape,
        ShapeName: shape.ShapeName,
        Paging: paging,
        ViewFilter: viewFilter,
        SortOrder: sortResults,
        FocusedViewFilter: convertToOwsFocusedViewFilter(focusedViewFilter),
        CategoryFilter: categoryName ?? undefined,
        Traversal: getFindConversationTraversal(viewFilter),
    };

    if (restriction) {
        requestBody.Restriction = restriction;
    }

    if (refinerRestriction) {
        requestBody.RefinerRestriction = refinerRestriction;
    }

    if (searchFolderId) {
        requestBody.SearchFolderId = folderId({ Id: searchFolderId });
    }

    return findConversationOperation(
        {
            Header: getJsonRequestHeader(),
            Body: requestBody,
        },
        mailboxRequestOptions
    );
}
