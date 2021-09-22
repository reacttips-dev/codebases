import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetSharePointTextFileContentRequest from '../contract/GetSharePointTextFileContentRequest';
import type GetSharePointTextFileContentResponse from '../contract/GetSharePointTextFileContentResponse';
import getSharePointTextFileContentRequest from '../factory/getSharePointTextFileContentRequest';

export default function getSharePointTextFileContentOperation(
    req: { request: GetSharePointTextFileContentRequest },
    options?: RequestOptions
): Promise<GetSharePointTextFileContentResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = getSharePointTextFileContentRequest(req.request);
    }

    return makeServiceRequest<GetSharePointTextFileContentResponse>(
        'GetSharePointTextFileContent',
        req,
        options
    );
}
