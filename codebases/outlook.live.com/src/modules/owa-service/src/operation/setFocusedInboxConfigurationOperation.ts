import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SetFocusedInboxConfigurationRequest from '../contract/SetFocusedInboxConfigurationRequest';
import type SetFocusedInboxConfigurationResponse from '../contract/SetFocusedInboxConfigurationResponse';
import setFocusedInboxConfigurationRequest from '../factory/setFocusedInboxConfigurationRequest';

export default function setFocusedInboxConfigurationOperation(
    req: { request: SetFocusedInboxConfigurationRequest },
    options?: RequestOptions
): Promise<SetFocusedInboxConfigurationResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = setFocusedInboxConfigurationRequest(req.request);
    }

    return makeServiceRequest<SetFocusedInboxConfigurationResponse>(
        'SetFocusedInboxConfiguration',
        req,
        options
    );
}
