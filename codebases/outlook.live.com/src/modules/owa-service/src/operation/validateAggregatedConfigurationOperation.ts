import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ValidateAggregatedConfigurationRequest from '../contract/ValidateAggregatedConfigurationRequest';
import type ValidateAggregatedConfigurationResponse from '../contract/ValidateAggregatedConfigurationResponse';
import validateAggregatedConfigurationRequest from '../factory/validateAggregatedConfigurationRequest';

export default function validateAggregatedConfigurationOperation(
    req: ValidateAggregatedConfigurationRequest,
    options?: RequestOptions
): Promise<ValidateAggregatedConfigurationResponse> {
    if (req !== undefined && !req['__type']) {
        req = validateAggregatedConfigurationRequest(req);
    }

    return makeServiceRequest<ValidateAggregatedConfigurationResponse>(
        'ValidateAggregatedConfiguration',
        req,
        options
    );
}
