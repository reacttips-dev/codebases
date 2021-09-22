import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type TargetFolderMruConfiguration from '../contract/TargetFolderMruConfiguration';

export default function getFolderMruConfigurationOperation(
    options?: RequestOptions
): Promise<TargetFolderMruConfiguration> {
    return makeServiceRequest<TargetFolderMruConfiguration>(
        'GetFolderMruConfiguration',
        {},
        options
    );
}
