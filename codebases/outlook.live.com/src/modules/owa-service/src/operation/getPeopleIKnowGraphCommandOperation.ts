import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetPeopleIKnowGraphRequest from '../contract/GetPeopleIKnowGraphRequest';
import type GetPeopleIKnowGraphResponse from '../contract/GetPeopleIKnowGraphResponse';
import getPeopleIKnowGraphRequest from '../factory/getPeopleIKnowGraphRequest';

export default function getPeopleIKnowGraphCommandOperation(
    req: { request: GetPeopleIKnowGraphRequest },
    options?: RequestOptions
): Promise<GetPeopleIKnowGraphResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = getPeopleIKnowGraphRequest(req.request);
    }

    return makeServiceRequest<GetPeopleIKnowGraphResponse>(
        'GetPeopleIKnowGraphCommand',
        req,
        options
    );
}
