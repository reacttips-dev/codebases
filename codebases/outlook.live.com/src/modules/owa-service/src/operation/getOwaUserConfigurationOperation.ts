import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type OwaUserConfiguration from '../contract/OwaUserConfiguration';

export default function getOwaUserConfigurationOperation(
    options?: RequestOptions
): Promise<OwaUserConfiguration> {
    return makeServiceRequest<OwaUserConfiguration>('GetOwaUserConfiguration', {}, options);
}
