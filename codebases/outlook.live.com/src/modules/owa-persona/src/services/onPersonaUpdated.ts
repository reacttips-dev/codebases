import downloadPersonaPhoto from '../actions/downloadPersonaPhoto';
import getHexConsumerIdForUser from '../actions/getHexConsumerIdForUser';
import mapPersonaToPersonaViewState from '../actions/helpers/mapPersonaToPersonaViewState';
import refreshPersonaPhoto from '../actions/refreshPersonaPhoto';
import getPersonaPhotoUrl, { getPersonaPhotoUrlFromhexCID } from '../utils/getPersonaPhotoUrl';
import isImageApiEnabled from '../utils/isImageApiEnabled';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import type PersonaType from 'owa-service/lib/contract/PersonaType';

export default function onPersonaUpdated(
    personaType: PersonaType,
    updatedProperties: { profilePhotoDataUrl?: string }
): void {
    if (updatedProperties?.profilePhotoDataUrl) {
        // Contact photo has been updated. We need to invalidate and refetch contact photo

        const email = personaType.EmailAddresses?.[0]
            ? personaType.EmailAddresses[0].EmailAddress
            : undefined;
        const personaId = personaType.PersonaId ? personaType.PersonaId.Id : undefined;

        // First, trigger re-fetching of cached photos displayed by the PersonaControl which is used throughout the hub
        refreshPersonaPhoto(email, personaId);

        // Then, manually trigger refetching of the photo used by Card/EV/Contact editor
        if (email) {
            const hexCid: string = getHexConsumerIdForUser(email);
            const mailboxType =
                personaType.PersonaTypeString == 'ModernGroup' ? 'GroupMailbox' : '';

            // If the IAPI flight is enabled we should call directly into downloadPersonaPhoto to ensure proper authentication on the request
            if (isImageApiEnabled()) {
                const personaViewState = mapPersonaToPersonaViewState(
                    personaType.DisplayName,
                    hexCid,
                    email,
                    personaId,
                    PersonaSize.regular,
                    mailboxType
                );

                downloadPersonaPhoto(personaViewState, true /*forceFetch*/);
            } else {
                const photoUrl = hexCid
                    ? getPersonaPhotoUrlFromhexCID(hexCid, mailboxType, PersonaSize.regular)
                    : getPersonaPhotoUrl(email, personaId, mailboxType);

                fetch(photoUrl, {
                    headers: { 'Cache-Control': 'no-cache' },
                    credentials: 'include',
                });
            }
        }
    }
}
