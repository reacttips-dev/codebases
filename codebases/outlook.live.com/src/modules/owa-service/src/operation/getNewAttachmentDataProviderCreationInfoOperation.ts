import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetNewAttachmentDataProviderCreationInfoRequest from '../contract/GetNewAttachmentDataProviderCreationInfoRequest';
import type GetNewAttachmentDataProviderCreationInfoResponse from '../contract/GetNewAttachmentDataProviderCreationInfoResponse';
import getNewAttachmentDataProviderCreationInfoRequest from '../factory/getNewAttachmentDataProviderCreationInfoRequest';

export default function getNewAttachmentDataProviderCreationInfoOperation(
    req: GetNewAttachmentDataProviderCreationInfoRequest,
    options?: RequestOptions
): Promise<GetNewAttachmentDataProviderCreationInfoResponse> {
    if (req !== undefined && !req['__type']) {
        req = getNewAttachmentDataProviderCreationInfoRequest(req);
    }

    return makeServiceRequest<GetNewAttachmentDataProviderCreationInfoResponse>(
        'GetNewAttachmentDataProviderCreationInfo',
        req,
        options
    );
}
