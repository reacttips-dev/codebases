import type GetAttachmentPreviewsResponse from 'owa-service/lib/contract/GetAttachmentPreviewsResponse';
import type GetAttachmentPreviewsRequest from 'owa-service/lib/contract/GetAttachmentPreviewsRequest';
import getAttachmentPreviewsOperation from 'owa-service/lib/operation/getAttachmentPreviewsOperation';
import getAttachmentPreviewsRequest from 'owa-service/lib/factory/getAttachmentPreviewsRequest';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default function getAttachmentPreviews(
    conversationIds: ItemId[],
    requestOptions?: RequestOptions,
    requestData?: GetAttachmentPreviewsRequest
): Promise<GetAttachmentPreviewsResponse> {
    const requestBody = getAttachmentPreviewsRequest({
        ...requestData,
        ConversationIds: conversationIds,
    });

    return getAttachmentPreviewsOperation(requestBody, requestOptions).then(response => {
        return response;
    });
}
