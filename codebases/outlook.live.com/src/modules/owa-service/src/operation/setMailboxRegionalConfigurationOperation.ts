import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SetMailboxRegionalConfigurationRequest from '../contract/SetMailboxRegionalConfigurationRequest';
import type SetMailboxRegionalConfigurationResponse from '../contract/SetMailboxRegionalConfigurationResponse';
import setMailboxRegionalConfigurationRequest from '../factory/setMailboxRegionalConfigurationRequest';

export default function setMailboxRegionalConfigurationOperation(
    req: SetMailboxRegionalConfigurationRequest,
    options?: RequestOptions
): Promise<SetMailboxRegionalConfigurationResponse> {
    if (req !== undefined && !req['__type']) {
        req = setMailboxRegionalConfigurationRequest(req);
    }

    return makeServiceRequest<SetMailboxRegionalConfigurationResponse>(
        'SetMailboxRegionalConfiguration',
        req,
        options
    );
}
