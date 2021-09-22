import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateMasterCategoryListRequest from '../contract/UpdateMasterCategoryListRequest';
import type UpdateMasterCategoryListResponse from '../contract/UpdateMasterCategoryListResponse';
import updateMasterCategoryListRequest from '../factory/updateMasterCategoryListRequest';

export default function updateMasterCategoryListOperation(
    req: { request: UpdateMasterCategoryListRequest },
    options?: RequestOptions
): Promise<UpdateMasterCategoryListResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = updateMasterCategoryListRequest(req.request);
    }

    return makeServiceRequest<UpdateMasterCategoryListResponse>(
        'UpdateMasterCategoryList',
        req,
        options
    );
}
