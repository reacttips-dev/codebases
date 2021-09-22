import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import type { ClientAttachmentId } from 'owa-client-ids';

export default function getSaveToCloudEstimatedCompleteTimeInMS(
    attachmentId: ClientAttachmentId
): number {
    const attachmentModel = getAttachment(attachmentId);
    return estimateTimeToUploadLocalFile(attachmentModel.model.Size);
}

export function getAttachCloudFileCompleteTimeInMS(attachmentSize: number): number {
    return 2856 + 0.00145 * attachmentSize; //used linear regression to find best fit with our ctqs.
}

export function getShareLocalFileCompleteTimeInMS(attachmentSize: number): number {
    // Multiply our upload time by a factor because this action  will be upload the file to the OWA server and
    // then to OD server. The factor was chosen based on the times displayed by our CTQs
    return estimateTimeToUploadLocalFile(attachmentSize) * 4;
}

export function getAttachUriFileCompleteTimeInMS(attachmentSize: number): number {
    return estimateTimeToUploadLocalFile(attachmentSize) * 4;
}

export function getAddToCalendarEventEstimateCompleteTimeInMS(size: number): number {
    return estimateTimeToUploadLocalFile(size) * 2;
}

function estimateTimeToUploadLocalFile(attachmentSize: number): number {
    return Math.round(attachmentSize / 256); // about 4 seconds for 1MB
}
