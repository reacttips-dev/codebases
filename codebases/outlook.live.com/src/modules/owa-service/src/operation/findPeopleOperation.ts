import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FindPeopleJsonRequest from '../contract/FindPeopleJsonRequest';
import type FindPeopleJsonResponse from '../contract/FindPeopleJsonResponse';
import findPeopleJsonRequest from '../factory/findPeopleJsonRequest';

export default function findPeopleOperation(
    req: FindPeopleJsonRequest,
    options?: RequestOptions
): Promise<FindPeopleJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = findPeopleJsonRequest(req);
    }

    return makeServiceRequest<FindPeopleJsonResponse>('FindPeople', req, options);
}
