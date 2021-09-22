import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ComplianceConfiguration from '../contract/ComplianceConfiguration';

export default function getComplianceConfigurationOperation(
    options?: RequestOptions
): Promise<ComplianceConfiguration> {
    return makeServiceRequest<ComplianceConfiguration>('GetComplianceConfiguration', {}, options);
}
