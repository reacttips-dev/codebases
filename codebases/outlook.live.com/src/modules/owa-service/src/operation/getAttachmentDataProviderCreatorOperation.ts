import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAttachmentDataProviderCreatorRequest from '../contract/GetAttachmentDataProviderCreatorRequest';
import type GetAttachmentDataProviderCreatorResponse from '../contract/GetAttachmentDataProviderCreatorResponse';
import getAttachmentDataProviderCreatorRequest from '../factory/getAttachmentDataProviderCreatorRequest';

export default function getAttachmentDataProviderCreatorOperation(
    req: GetAttachmentDataProviderCreatorRequest,
    options?: RequestOptions
): Promise<GetAttachmentDataProviderCreatorResponse> {
    if (req !== undefined && !req['__type']) {
        req = getAttachmentDataProviderCreatorRequest(req);
    }

    return makeServiceRequest<GetAttachmentDataProviderCreatorResponse>(
        'GetAttachmentDataProviderCreator',
        req,
        options
    );
}
