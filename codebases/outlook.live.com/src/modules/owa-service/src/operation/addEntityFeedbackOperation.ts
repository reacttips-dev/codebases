import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type AddEntityFeedbackJsonRequest from '../contract/AddEntityFeedbackJsonRequest';
import type AddEntityFeedbackJsonResponse from '../contract/AddEntityFeedbackJsonResponse';
import addEntityFeedbackJsonRequest from '../factory/addEntityFeedbackJsonRequest';

export default function addEntityFeedbackOperation(
    req: AddEntityFeedbackJsonRequest,
    options?: RequestOptions
): Promise<AddEntityFeedbackJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = addEntityFeedbackJsonRequest(req);
    }

    return makeServiceRequest<AddEntityFeedbackJsonResponse>('AddEntityFeedback', req, options);
}
