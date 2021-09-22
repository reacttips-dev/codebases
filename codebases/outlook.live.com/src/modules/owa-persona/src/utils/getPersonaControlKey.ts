import isImageApiEnabled from './isImageApiEnabled';
import type { PersonaSize } from '@fluentui/react/lib/Persona';

export default function getPersonaControlKey(
    emailAddress: string,
    personaId: string,
    size: PersonaSize,
    mailboxType: string,
    name?: string
): string {
    let personaControlKey = '';
    const isIAPIEnabled = isImageApiEnabled();

    if (emailAddress) {
        personaControlKey += emailAddress.toLowerCase();
    } else if (personaId) {
        personaControlKey += personaId;
    } else if (name) {
        personaControlKey += name.toLowerCase();
    }

    // Mailbox type is only used with IAPI
    if (mailboxType && isIAPIEnabled) {
        personaControlKey += mailboxType;
    }

    // IAPI is currently only fetching one size of persona image
    // Omit it from the key if IAPI is enabled
    if (size && !isIAPIEnabled) {
        personaControlKey += size;
    }

    return personaControlKey;
}
