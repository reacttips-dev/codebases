import { getUserConfigurationForUser } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';

export default function getRoutingKeyPrefixForSmtpAddress(userIdentity?: string): string {
    const userConfiguration = getUserConfigurationForUser(userIdentity);

    // This shouldn't happen in production, but if it does we'll have a hint.
    if (!userConfiguration || !userConfiguration.SessionSettings) {
        return 'no-routing-key:';
    }

    if (userConfiguration.SessionSettings.WebSessionType === WebSessionType.Business) {
        // This is rolling out now, but gated by CAFE support.
        // https://exp.microsoft.com/a/feature/e4b89f0c-6e3d-4a5d-b6d3-c2d9deccdf1c
        if (isFeatureEnabled('doc-attachment-routingKeyAadSmtp')) {
            // The prefix was originally "AAD-SMTP" but has changed to just "SMTP".
            // The feature ID was created prior to that change.
            // https://substrate.microsoft.net/documentation/Develop/Authentication/Best-practices/Routing-best-practices#
            return 'SMTP:';
        } else {
            return '';
        }
    } else {
        return 'MSA:';
    }
}
