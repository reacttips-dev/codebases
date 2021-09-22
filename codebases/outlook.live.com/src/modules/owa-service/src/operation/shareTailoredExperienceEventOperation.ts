import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ShareTailoredExperienceEventJsonRequest from '../contract/ShareTailoredExperienceEventJsonRequest';
import type ShareTailoredExperienceEventJsonResponse from '../contract/ShareTailoredExperienceEventJsonResponse';
import shareTailoredExperienceEventJsonRequest from '../factory/shareTailoredExperienceEventJsonRequest';

export default function shareTailoredExperienceEventOperation(
    req: ShareTailoredExperienceEventJsonRequest,
    options?: RequestOptions
): Promise<ShareTailoredExperienceEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = shareTailoredExperienceEventJsonRequest(req);
    }

    return makeServiceRequest<ShareTailoredExperienceEventJsonResponse>(
        'ShareTailoredExperienceEvent',
        req,
        options
    );
}
