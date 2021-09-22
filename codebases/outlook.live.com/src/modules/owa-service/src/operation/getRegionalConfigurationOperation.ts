import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetRegionalConfigurationRequest from '../contract/GetRegionalConfigurationRequest';
import type GetRegionalConfigurationResponse from '../contract/GetRegionalConfigurationResponse';
import getRegionalConfigurationRequest from '../factory/getRegionalConfigurationRequest';

export default function getRegionalConfigurationOperation(
    req: GetRegionalConfigurationRequest,
    options?: RequestOptions
): Promise<GetRegionalConfigurationResponse> {
    if (req !== undefined && !req['__type']) {
        req = getRegionalConfigurationRequest(req);
    }

    return makeServiceRequest<GetRegionalConfigurationResponse>(
        'GetRegionalConfiguration',
        req,
        options
    );
}
