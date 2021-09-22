import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from './getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import { getRecipientFromCacheForSmtp } from 'owa-recipient-cache/lib/selectors/getRecipientFromCacheForSmtp';
import { isPersonaFindRecipientPersonaType } from './isPersonaFindRecipientPersonaType';

export function getPersonaFromCacheByEmailAddress(
    emailAddress: EmailAddressWrapper
): ReadWriteRecipientViewState | null {
    if (
        isFeatureEnabled('cmp-resolveRecipsFromCache') &&
        emailAddress.RoutingType === 'SMTP' &&
        emailAddress.EmailAddress
    ) {
        const cachedPersona = getRecipientFromCacheForSmtp(emailAddress.EmailAddress);
        if (cachedPersona && isPersonaFindRecipientPersonaType(cachedPersona)) {
            return getReadWriteRecipientViewStateFromFindRecipientPersonaType(cachedPersona);
        }
    }
    return null;
}
