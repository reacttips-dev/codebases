import { isFeatureEnabled } from 'owa-feature-flags';
import { searchCacheWithFunction } from 'owa-recipient-cache/lib/selectors/searchCache';
import isCacheEmpty from 'owa-recipient-cache/lib/utils/isCacheEmpty';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function isImageApiEnabled(): boolean {
    return (
        isConsumer() &&
        isFeatureEnabled('rp-imageApiConsumer') &&
        !getUserConfiguration().SessionSettings.IsShadowMailbox
    );
}

// IMPORTANT: IAPI currently does not support contact photos
// Until then we will use this function to check if the smtp is a contact and return whether IAPI should be used
export function shouldUseImageApi(personaId: string, smtp: string): boolean {
    if (!smtp) {
        return false;
    }

    // If there is a personaId we should not use IAPI, as this means it is coming from PeopleHub and it is a contact
    if (!!personaId) {
        return false;
    }

    // In Mail module we don't get the personaId from the EmailAddressWrapper
    // We do a quick recipient cache search, if there is no contact that matches we will continue to use IAPI
    if (isCacheEmpty()) {
        return false;
    }

    const isContact = persona =>
        persona.PeopleSubtype === 'PersonalContact' &&
        persona.EmailAddress.RoutingType === 'SMTP' &&
        persona.EmailAddress.EmailAddress &&
        persona.EmailAddress.EmailAddress.toLowerCase() === smtp.toLowerCase();

    const result = searchCacheWithFunction(
        isContact,
        1 //numberOfResults
    );

    return result.length == 0;
}
