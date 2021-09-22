import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getRoutingKeyPrefixForSmtpAddress from './getRoutingKeyPrefixForSmtpAddress';
import { isFeatureEnabled } from 'owa-feature-flags';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import * as trace from 'owa-trace';

// This is exported for the sake of unit testing. It is not intended for use by application code.
//
// This handles the address fallback scenarios for the getInstance method below.
export function getFallbackAddress(
    hexCID: string,
    notManagedAddresses: readonly string[],
    proxyAddresses: readonly string[]
): string {
    if (!!proxyAddresses) {
        for (const proxyAddress of proxyAddresses) {
            if (!isGeneratedAddress(hexCID, proxyAddress)) {
                return proxyAddress;
            }
        }
    }

    if (!!notManagedAddresses && notManagedAddresses.length > 0) {
        return notManagedAddresses[0];
    }

    // Do not change this value, we'll be searching for it in the logs.
    return 'NoResolvableAddress@invalid.outlook.com';
}

// This is exported for the sake of unit testing. It is not intended for use by application code.
// SPECIAL EXCEPTION: widget scenario
//
// Migrated users with EASI-ID accounts ended up with their primary SMTP
// address set to something of the form outlook_HEXADECIMAL@outlook.com,
// where the HEXADECIMAL segment is the account's CID.
//
// Those generated addresses do not exist in mserv, and the OWA server
// resolves consumers via mserv, so we can't use those addresses in download
// URLs. So we need to be able to detect them.
export function isGeneratedAddress(hexCID: string, emailAddress: string): boolean {
    const generatedAddress = 'outlook_' + hexCID + '@outlook.com';
    return generatedAddress.toLowerCase() === emailAddress.toLowerCase();
}

// The value returned from this function is intended for use by CAFE to route
// requests to the correct mailbox server. It should not be used for any other
// purpose. The returned values will change as routing-key requirements change.
export default function getDefaultRoutingKey(): string {
    let routingKey = getDefaultRoutingKeyInternal();
    routingKey = encodeURIComponent(routingKey);
    return routingKey;
}

function getDefaultRoutingKeyInternal(): string {
    const userConfiguration = getUserConfiguration();

    // This shouldn't happen in production, but if it does, this value will
    // indicate what went wrong.
    if (!userConfiguration || !userConfiguration.SessionSettings) {
        trace.errorThatWillCauseAlert('SessionSettings not available');
        return 'no-routing-key';
    }

    // This will work for business users, and for most consumers.
    let routingKey = userConfiguration.SessionSettings.UserEmailAddress;

    if (userConfiguration.SessionSettings.WebSessionType === WebSessionType.Business) {
        return getRoutingKeyPrefixForSmtpAddress() + routingKey;
    }

    if (isFeatureEnabled('doc-attachment-routingKeyPuid')) {
        return (
            'PUID:' +
            userConfiguration.SessionSettings.UserPuid +
            '@' +
            userConfiguration.SessionSettings.TenantGuid
        );
    }

    if (userConfiguration.SessionSettings.IsShadowMailbox) {
        // For shadow mailboxes, UserEmailAddress doesn't resolve in mserv,
        // but userConfiguration.SessionSettings.LogonEmailAddress does.
        return (
            getRoutingKeyPrefixForSmtpAddress() +
            userConfiguration.SessionSettings.LogonEmailAddress
        );
    } else if (
        isGeneratedAddress(
            userConfiguration.HexCID,
            userConfiguration.SessionSettings.UserEmailAddress
        )
    ) {
        // For migrated EASI-ID mailboxes, neither UserEmailAddress
        // nor LogonEmailAddress resolves in mserv, but the
        // NotManagedEmailAddresses collection typically contains just
        // one address, which is resolvable. And we'll try the proxy
        // address collection if the not-managed collection is empty.
        return (
            getRoutingKeyPrefixForSmtpAddress() +
            getFallbackAddress(
                userConfiguration.HexCID,
                userConfiguration.SessionSettings.NotManagedEmailAddresses,
                userConfiguration.SessionSettings.UserProxyAddresses
            )
        );
    }

    return getRoutingKeyPrefixForSmtpAddress() + routingKey;
}
