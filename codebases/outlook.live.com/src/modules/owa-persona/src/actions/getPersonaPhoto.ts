import getPersonaFromHexCID from './getPersonaFromHexCID';
import getPersonaPhotoQueue from './getPersonaPhotoQueue';
import mapPersonaToPersonaViewState from './helpers/mapPersonaToPersonaViewState';
import type PersonaControlViewState from '../store/schema/PersonaControlViewState';
import personaControlStore from '../store/Store';
import getPersonaControlKey from '../utils/getPersonaControlKey';
import isImageApiEnabled from '../utils/isImageApiEnabled';
import type { ObservableMap } from 'mobx';
import type { PersonaSize } from '@fluentui/react/lib/Persona';
import { action } from 'satcheljs/lib/legacy';
import getHexConsumerIdForUser from './getHexConsumerIdForUser';

export interface GetPersonaPhotoState {
    personaViewStates: ObservableMap<string, PersonaControlViewState>;
}

/**
 * Gets the persona photo
 * @param name of the persona
 * @param emailAddress email address of the persona
 * @param size the size of the persona
 * @param hexCID hex id for a persona
 */
export default action('getPersonaPhoto')(function getPersonaPhoto(
    name: string,
    emailAddress: string,
    personaId: string,
    size: PersonaSize,
    hexCID: string,
    mailboxType: string,
    skipLoadingPhoto: () => boolean,
    state: GetPersonaPhotoState = { personaViewStates: personaControlStore.viewStates }
) {
    let personaKey = getPersonaControlKey(emailAddress, personaId, size, mailboxType, name);
    if (!state.personaViewStates.has(personaKey)) {
        state.personaViewStates.set(
            personaKey,
            mapPersonaToPersonaViewState(
                name,
                hexCID || getHexConsumerIdForUser(emailAddress),
                emailAddress,
                personaId,
                size,
                mailboxType
            )
        );
    }
    let personaViewState = state.personaViewStates.get(personaKey);
    if (!isImageApiEnabled() && personaViewState.hexConsumerIdForUser) {
        getPersonaFromHexCID(personaViewState);
    } else {
        getPersonaPhotoQueue.add({
            name,
            emailAddress,
            personaId,
            size,
            mailboxType,
            skipLoadingPhoto,
        });
    }
});
