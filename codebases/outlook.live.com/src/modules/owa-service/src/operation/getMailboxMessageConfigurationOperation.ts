import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetMailboxMessageConfigurationResponse from '../contract/GetMailboxMessageConfigurationResponse';

export default function getMailboxMessageConfigurationOperation(
    options?: RequestOptions
): Promise<GetMailboxMessageConfigurationResponse> {
    return makeServiceRequest<GetMailboxMessageConfigurationResponse>(
        'GetMailboxMessageConfiguration',
        {},
        options
    );
}
