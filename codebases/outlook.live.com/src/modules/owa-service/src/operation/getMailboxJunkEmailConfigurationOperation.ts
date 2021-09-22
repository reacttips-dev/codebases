import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetMailboxJunkEmailConfigurationResponse from '../contract/GetMailboxJunkEmailConfigurationResponse';

export default function getMailboxJunkEmailConfigurationOperation(
    options?: RequestOptions
): Promise<GetMailboxJunkEmailConfigurationResponse> {
    return makeServiceRequest<GetMailboxJunkEmailConfigurationResponse>(
        'GetMailboxJunkEmailConfiguration',
        {},
        options
    );
}
