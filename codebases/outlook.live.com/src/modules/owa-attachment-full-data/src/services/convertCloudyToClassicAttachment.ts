import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import convertRefToLocalAttachmentRequest from 'owa-service/lib/factory/convertRefToLocalAttachmentRequest';
import convertRefToLocalAttachmentOperation from 'owa-service/lib/operation/convertRefToLocalAttachmentOperation';

function createRequestBody(
    attachmentId: string,
    parentItemId: string,
    subscriptionId: string,
    channelId: string,
    cancellationId: string,
    fullPathLocation: string,
    permissionLevel?: AttachmentPermissionLevel,
    attachmentDataProviderId?: string
) {
    return convertRefToLocalAttachmentRequest({
        ewsAttachmentId: attachmentId,
        emailId: parentItemId,
        subscriptionId: subscriptionId,
        channelId: channelId,
        cancellationId: cancellationId,
        fullPathLocation: fullPathLocation,
        attachmentDataProviderId: attachmentDataProviderId,
        PermissionLevel: permissionLevel,
    });
}

export default function convertCloudyToClassicAttachment(
    attachmentId: string,
    parentItemId: string,
    subscriptionId: string,
    channelId: string,
    cancellationId: string,
    fullPathLocation: string,
    permissionLevel?: AttachmentPermissionLevel,
    attachmentDataProviderId?: string
): Promise<string> {
    const requestBody = createRequestBody(
        attachmentId,
        parentItemId,
        subscriptionId,
        channelId,
        cancellationId,
        fullPathLocation,
        permissionLevel,
        attachmentDataProviderId
    );

    return convertRefToLocalAttachmentOperation({
        requestObject: requestBody,
    });
}
