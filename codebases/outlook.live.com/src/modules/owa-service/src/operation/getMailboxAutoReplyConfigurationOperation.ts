import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetMailboxAutoReplyConfigurationResponse from '../contract/GetMailboxAutoReplyConfigurationResponse';

export default function getMailboxAutoReplyConfigurationOperation(
    options?: RequestOptions
): Promise<GetMailboxAutoReplyConfigurationResponse> {
    return makeServiceRequest<GetMailboxAutoReplyConfigurationResponse>(
        'GetMailboxAutoReplyConfiguration',
        {},
        options
    );
}
