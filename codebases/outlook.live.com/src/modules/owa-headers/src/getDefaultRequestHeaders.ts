import { getExplicitLogonHeaders } from './getExplicitLogonHeaders';
import { isConnectedAccount } from 'owa-accounts-store';
import type { MailboxInfo } from 'owa-client-ids';
import { getConnectedAccountHeaders } from 'owa-connected-account-headers';
import { createDefaultHeaders } from 'owa-service/lib/createDefaultHeader';

import assign from 'object-assign';

export async function getDefaultRequestHeaders(
    mailboxInfo: MailboxInfo
): Promise<{ [headerName: string]: string }> {
    return createDefaultHeaders().then(async headers => {
        if (mailboxInfo) {
            if (isConnectedAccount(mailboxInfo.userIdentity)) {
                const connectedAccountHeaders = await getConnectedAccountHeaders(
                    mailboxInfo.userIdentity,
                    mailboxInfo.type == 'GroupMailbox' || mailboxInfo.type == 'TeamsMailbox'
                        ? mailboxInfo.mailboxSmtpAddress
                        : null
                );
                assign(headers, connectedAccountHeaders);
            } else {
                if (mailboxInfo.type == 'GroupMailbox' || mailboxInfo.type == 'TeamsMailbox') {
                    const explicitLogonHeaders = getExplicitLogonHeaders(
                        mailboxInfo.mailboxSmtpAddress
                    );
                    assign(headers, explicitLogonHeaders);
                }
            }
        }

        return headers;
    });
}
