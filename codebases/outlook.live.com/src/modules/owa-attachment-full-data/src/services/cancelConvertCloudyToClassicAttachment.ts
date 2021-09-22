import type CancelConvertRefToLocalAttachmentRequest from 'owa-service/lib/contract/CancelConvertRefToLocalAttachmentRequest';
import cancelConvertRefToLocalAttachmentRequest from 'owa-service/lib/factory/cancelConvertRefToLocalAttachmentRequest';
import cancelConvertRefToLocalAttachmentOperation from 'owa-service/lib/operation/cancelConvertRefToLocalAttachmentOperation';

function createRequestBody(cancellationId: string): CancelConvertRefToLocalAttachmentRequest {
    return cancelConvertRefToLocalAttachmentRequest({
        cancellationId: cancellationId,
    });
}

export default function cancelConvertClassicToCloudyAttachment(
    cancellationId: string
): Promise<boolean> {
    const requestBody = createRequestBody(cancellationId);
    return cancelConvertRefToLocalAttachmentOperation(requestBody);
}
