import type GetMailboxJunkEmailConfigurationResponse from 'owa-service/lib/contract/GetMailboxJunkEmailConfigurationResponse';
import getMailboxJunkEmailConfigurationOperation from 'owa-service/lib/operation/getMailboxJunkEmailConfigurationOperation';

function processResponseMessage(
    responseMessage: GetMailboxJunkEmailConfigurationResponse
): string[] {
    if (responseMessage != null && responseMessage.ErrorMessage == null) {
        return responseMessage.Options.TrustedSendersAndDomains;
    }
    return null;
}

export default async function loadTrustedSendersAndDomains(): Promise<string[]> {
    return getMailboxJunkEmailConfigurationOperation().then(responseMessage => {
        return processResponseMessage(responseMessage);
    });
}
