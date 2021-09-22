import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAttachmentUploadFolderPropsResponse from '../contract/GetAttachmentUploadFolderPropsResponse';

export default function getAttachmentDataProviderUploadFolderPropsOperation(
    req: {},
    options?: RequestOptions
): Promise<GetAttachmentUploadFolderPropsResponse> {
    return makeServiceRequest<GetAttachmentUploadFolderPropsResponse>(
        'GetAttachmentDataProviderUploadFolderProps',
        req,
        options
    );
}
