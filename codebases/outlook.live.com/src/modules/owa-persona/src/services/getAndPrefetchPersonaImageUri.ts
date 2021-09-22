import getHexConsumerIdForUser from '../actions/getHexConsumerIdForUser';
import getPersonaPhotoUrl, { getPersonaPhotoUrlFromhexCID } from '../utils/getPersonaPhotoUrl';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import type { PersonaIdentifiers } from '../personaConfig';
import getTokenForImageApi from '../utils/getTokenForImageApi';

export type ImageSizeType = 'smallRounded' | 'largeRounded';

export default function getAndPrefetchPersonaImageUri(
    personaId: PersonaIdentifiers,
    callback: (uri?: string, headers?: { [key in string]: string }, error?: string) => void,
    imageStyle?: ImageSizeType
): void {
    const hexCid: string = getHexConsumerIdForUser(personaId.Smtp);
    let headers = {};
    getTokenForImageApi().then((token: string) => {
        if (token) {
            headers = {
                Authorization: `Bearer ${token}`,
                'X-AnchorMailbox': personaId.Smtp,
            };
        }
        const mailboxType = personaId.PersonaType == 'Group' ? 'GroupMailbox' : undefined;
        callback(
            hexCid
                ? getPersonaPhotoUrlFromhexCID(hexCid, mailboxType, PersonaSize.regular)
                : getPersonaPhotoUrl(
                      personaId.Smtp,
                      personaId.OlsPersonaId,
                      mailboxType,
                      imageStyle === 'largeRounded'
                  ),
            headers
        );
    });
}
