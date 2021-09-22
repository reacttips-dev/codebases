import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SetMailboxMessageConfigurationRequest from '../contract/SetMailboxMessageConfigurationRequest';
import type OptionsResponseBase from '../contract/OptionsResponseBase';
import setMailboxMessageConfigurationRequest from '../factory/setMailboxMessageConfigurationRequest';

export default function setMailboxMessageConfigurationOperation(
    req: SetMailboxMessageConfigurationRequest,
    options?: RequestOptions
): Promise<OptionsResponseBase> {
    if (req !== undefined && !req['__type']) {
        req = setMailboxMessageConfigurationRequest(req);
    }

    return makeServiceRequest<OptionsResponseBase>('SetMailboxMessageConfiguration', req, options);
}
