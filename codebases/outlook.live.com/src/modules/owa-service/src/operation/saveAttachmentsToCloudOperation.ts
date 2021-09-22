import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SaveAttachmentsToCloudRequest from '../contract/SaveAttachmentsToCloudRequest';
import saveAttachmentsToCloudRequest from '../factory/saveAttachmentsToCloudRequest';

export default function saveAttachmentsToCloudOperation(
    req: { requestObject: SaveAttachmentsToCloudRequest },
    options?: RequestOptions
): Promise<string> {
    if (req.requestObject !== undefined && !req.requestObject['__type']) {
        req.requestObject = saveAttachmentsToCloudRequest(req.requestObject);
    }

    return makeServiceRequest<string>('SaveAttachmentsToCloud', req, options);
}
