import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FindCategoryDetailsJsonRequest from '../contract/FindCategoryDetailsJsonRequest';
import type FindCategoryDetailsJsonResponse from '../contract/FindCategoryDetailsJsonResponse';
import findCategoryDetailsJsonRequest from '../factory/findCategoryDetailsJsonRequest';

export default function findCategoryDetailsOperation(
    req: FindCategoryDetailsJsonRequest,
    options?: RequestOptions
): Promise<FindCategoryDetailsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = findCategoryDetailsJsonRequest(req);
    }

    return makeServiceRequest<FindCategoryDetailsJsonResponse>('FindCategoryDetails', req, options);
}
