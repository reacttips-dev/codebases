import type ItemId from 'owa-service/lib/contract/ItemId';
import convertLocalToRefAttachmentRequest from 'owa-service/lib/factory/convertLocalToRefAttachmentRequest';
import convertLocalToRefAttachmentOperation from 'owa-service/lib/operation/convertLocalToRefAttachmentOperation';

function createRequestBody(
    attachmentId: string,
    parentItemId: ItemId,
    subscriptionId: string,
    channelId: string,
    cancellationId: string
) {
    return convertLocalToRefAttachmentRequest({
        ewsAttachmentId: {
            RootItemChangeKey: parentItemId.ChangeKey,
            RootItemId: parentItemId.Id,
            Id: attachmentId,
        },
        itemId: attachmentId,
        subscriptionId: subscriptionId,
        channelId: channelId,
        cancellationId: cancellationId,
    });
}

export default function convertClassicToCloudyAttachment(
    attachmentId: string,
    parentItemId: ItemId,
    subscriptionId: string,
    channelId: string,
    cancellationId: string
): Promise<string> {
    const requestBody = createRequestBody(
        attachmentId,
        parentItemId,
        subscriptionId,
        channelId,
        cancellationId
    );

    return convertLocalToRefAttachmentOperation({
        requestObject: requestBody,
    });
}
