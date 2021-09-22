import { orchestrator } from 'satcheljs';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { getUserMailboxInfo } from 'owa-client-ids';
import getMailboxByIdentityOperation from 'owa-service/lib/operation/getMailboxByIdentityOperation';
import { loadForwardingConfiguration } from '../actions/loadForwardingConfiguration';
import { retrievedForwardingConfiguration } from '../actions/retrievedForwardingConfiguration';

export const getForwardingConfiguration = orchestrator(loadForwardingConfiguration, async () => {
    const response = await getMailboxByIdentityOperation({
        Header: getJsonRequestHeader(),
        Identity: {
            RawIdentity: getUserMailboxInfo().mailboxSmtpAddress,
        },
    });
    if (response.WasSuccessful && response.MailboxOptions.AddressString) {
        retrievedForwardingConfiguration(response.MailboxOptions.AddressString);
    }
});
