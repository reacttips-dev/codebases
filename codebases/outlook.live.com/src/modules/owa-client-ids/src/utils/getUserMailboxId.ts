import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isGeneratedAddress, getFallbackAddress } from './getDefaultRoutingKey';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as trace from 'owa-trace';

// DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED
//
// This was created to return values that could be used as CAFE routing keys,
// so the logic to select which value to return reflects the needs of CAFE.
//
// However there is now a lot of code using it to obtain SMTP addresses, and
// CAFE now recommends routing keys that are not SMTP addresses, so this code
// is no longer useful for its intended purpose, and is no longer supported.
//
// Code that uses this to obtain an SMTP address should be revised to use
// something that doesn't encapsulate a bunch of CAFE quirks, so that this code
// can be removed.
//
// DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED
export default function getUserMailboxId(): string {
    const userConfiguration = getUserConfiguration();

    // This shouldn't happen in production, but if it does we'll have a breadcrumb.
    if (!userConfiguration || !userConfiguration.SessionSettings) {
        trace.errorThatWillCauseAlert('SessionSettings not available');
        return 'no-mailbox-id';
    }

    // This will work as a routing key for business users, and for most consumers.
    let mailboxId = userConfiguration.SessionSettings.UserEmailAddress;

    // This should help deprecate this function, by calling our attention to
    // which code can use an SMTP address, and which code needs something else.
    if (isFeatureEnabled('doc-attachment-usePrimarySmtpAddressForMailboxId')) {
        return mailboxId;
    }

    if (userConfiguration.SessionSettings.IsShadowMailbox) {
        // For shadow mailboxes, UserEmailAddress doesn't resolve in
        // mserv, but LogonEmailAddress does.
        mailboxId = userConfiguration.SessionSettings.LogonEmailAddress;
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
        mailboxId = getFallbackAddress(
            userConfiguration.HexCID,
            userConfiguration.SessionSettings.NotManagedEmailAddresses,
            userConfiguration.SessionSettings.UserProxyAddresses
        );
    }

    return mailboxId;
}
