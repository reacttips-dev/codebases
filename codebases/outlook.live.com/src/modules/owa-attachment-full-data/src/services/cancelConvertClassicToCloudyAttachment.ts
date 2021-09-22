import cancelConvertLocalToRefAttachmentRequest from 'owa-service/lib/factory/cancelConvertLocalToRefAttachmentRequest';
import cancelConvertLocalToRefAttachmentOperation from 'owa-service/lib/operation/cancelConvertLocalToRefAttachmentOperation';

function createRequestBody(cancellationId: string) {
    return cancelConvertLocalToRefAttachmentRequest({
        cancellationId: cancellationId,
    });
}

export default function cancelConvertClassicToCloudyAttachment(
    cancellationId: string
): Promise<boolean> {
    const requestBody = createRequestBody(cancellationId);
    return cancelConvertLocalToRefAttachmentOperation(requestBody);
}
