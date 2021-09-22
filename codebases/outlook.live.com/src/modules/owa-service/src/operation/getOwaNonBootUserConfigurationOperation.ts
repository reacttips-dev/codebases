import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type OwaNonBootUserConfiguration from '../contract/OwaNonBootUserConfiguration';

export default function getOwaNonBootUserConfigurationOperation(
    options?: RequestOptions
): Promise<OwaNonBootUserConfiguration> {
    return makeServiceRequest<OwaNonBootUserConfiguration>(
        'GetOwaNonBootUserConfiguration',
        {},
        options
    );
}
