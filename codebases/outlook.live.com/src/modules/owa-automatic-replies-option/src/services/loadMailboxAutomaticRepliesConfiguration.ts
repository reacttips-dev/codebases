import type MailboxAutoReplyConfigurationOptions from 'owa-service/lib/contract/MailboxAutoReplyConfigurationOptions';
import getMailboxAutoReplyConfigurationOperation from 'owa-service/lib/operation/getMailboxAutoReplyConfigurationOperation'; //';

/**
 * Makes the call to the server to get automatic reply configuration
 * @returns promise of MailboxAutoReplyConfigurationOptions type
 */
export default function loadMailboxAutomaticRepliesConfiguration(): Promise<MailboxAutoReplyConfigurationOptions> {
    return getMailboxAutoReplyConfigurationOperation().then(responseMessage => {
        if (responseMessage.WasSuccessful) {
            return responseMessage.Options;
        } else {
            throw new Error(
                `getMailboxAutoReplyConfigurationOperation ${responseMessage.ErrorCode} ${responseMessage.ErrorMessage}`
            );
        }
    });
}
