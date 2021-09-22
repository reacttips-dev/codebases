import getSipUri from './getSipUri';
import presenceStore from '../store/presenceStore';
import { PersonaPresence } from '@fluentui/react/lib/Persona';
import { isFeatureEnabled } from 'owa-feature-flags';
import type InstantMessagePresenceType from 'owa-service/lib/contract/InstantMessagePresenceType';

export default function getPresenceFromStore(imAddress: string): PersonaPresence {
    if (!isFeatureEnabled('fwk-skypeBusinessV2') || !imAddress) {
        return undefined;
    }

    const sipUri = getSipUri(imAddress);
    const presenceObj = getPersonaPresenceFromInstantMessagePresenceType(
        presenceStore.presences.get(sipUri)
    );
    return presenceObj ? presenceObj : undefined;
}

function getPersonaPresenceFromInstantMessagePresenceType(presence: InstantMessagePresenceType) {
    switch (presence) {
        case 'Offline':
            return PersonaPresence.offline;
        case 'Away':
        case 'BeRightBack':
            return PersonaPresence.away;
        case 'Busy':
        case 'IdleBusy':
            return PersonaPresence.busy;
        case 'DoNotDisturb':
            return PersonaPresence.dnd;
        case 'Online':
        case 'IdleOnline':
            return PersonaPresence.online;
        case 'None':
            return PersonaPresence.none;
    }
}
