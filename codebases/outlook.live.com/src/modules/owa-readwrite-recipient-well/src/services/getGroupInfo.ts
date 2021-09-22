import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type GetGroupInfoRequest from 'owa-service/lib/contract/GetGroupInfoRequest';
import type GetGroupResponse from 'owa-service/lib/contract/GetGroupResponse';
import GetGroupResultSet from 'owa-service/lib/contract/GetGroupResultSet';
import type IndexedPageView from 'owa-service/lib/contract/IndexedPageView';
import type ItemId from 'owa-service/lib/contract/ItemId';
import getGroupInfoRequest from 'owa-service/lib/factory/getGroupInfoRequest';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import getGroupInfoOperation from 'owa-service/lib/operation/getGroupInfoOperation';

const CONSUMER_GROUP_MAILBOX_TYPE = 'GroupMailbox';
const ANCHOR_MAILBOX_HEADER = 'X-AnchorMailbox';
const EXPLICIT_LOGON_USER_HEADER = 'x-owa-explicitlogonuser';

function configureIndexedPageView(maxEntriesReturned: number): IndexedPageView {
    return indexedPageView({
        BasePoint: 'Beginning',
        Offset: 0,
        MaxEntriesReturned: maxEntriesReturned,
    });
}

function configureRequestBody(
    itemId: ItemId,
    adObjectId: string,
    emailAddress: EmailAddressWrapper,
    maxEntriesReturned: number,
    shouldUseDeepExpansion: boolean
): GetGroupInfoRequest {
    return getGroupInfoRequest({
        ItemId: itemId,
        AdObjectId: adObjectId,
        EmailAddress: emailAddress,
        Paging: configureIndexedPageView(maxEntriesReturned),
        ResultSet: GetGroupResultSet.Members,
        ShouldUseDeepExpansion: shouldUseDeepExpansion,
    });
}

export function getGroupInfo(
    itemId: ItemId,
    adObjectId: string,
    emailAddress: EmailAddressWrapper,
    maxEntriesReturned: number = 200,
    shouldUseDeepExpansion: boolean = false
): Promise<GetGroupResponse> {
    let headers: Headers = new Headers();
    if (emailAddress.MailboxType == CONSUMER_GROUP_MAILBOX_TYPE) {
        headers.append(ANCHOR_MAILBOX_HEADER, emailAddress.EmailAddress);
        headers.append(EXPLICIT_LOGON_USER_HEADER, emailAddress.EmailAddress);
    }

    let requestBody = configureRequestBody(
        itemId,
        adObjectId,
        emailAddress,
        maxEntriesReturned,
        shouldUseDeepExpansion
    );
    return getGroupInfoOperation({ getGroupInfoRequest: requestBody }, { headers: headers }).then(
        response => {
            let responseMessage: GetGroupResponse = response;
            return responseMessage;
        }
    );
}
