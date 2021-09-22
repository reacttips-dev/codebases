import getImageUrl from './getImageUrl';
import isImageApiEnabled, { shouldUseImageApi } from './isImageApiEnabled';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import { assertNever } from 'owa-assert';
import { getConfig } from 'owa-service/lib/config';

const emailParamId = 'email';
const personIdParamId = 'personId';
const userActionParamId = 'UA';
const sizeParamId = 'size';
const serviceEndpoint = '/service.svc/s/GetPersonaPhoto';

/**
 * Gets url to get the persona photo
 * @param emailAddress Email address of the persona
 * @param personaId PersonaId of the persona
 */
export default function getPersonaPhotoUrl(
    emailAddress: string | null,
    personaId?: string,
    mailboxType?: string,
    largePhoto?: boolean
): string {
    /**
     * Image API does not provide support fetching contact photos hence
     * for a contact picture will be fetched using getPersona even
     * if Image API is enabled
     */
    if (isImageApiEnabled() && shouldUseImageApi(personaId, emailAddress)) {
        return getImageUrl(emailAddress, mailboxType);
    } else {
        let baseUrl = getConfig().baseUrl;
        let paramString = '';

        if (emailAddress) {
            paramString = appendUrlParam(
                paramString,
                emailParamId,
                emailAddress && emailAddress.toLowerCase()
            );
        }

        if (personaId) {
            paramString = appendUrlParam(paramString, personIdParamId, personaId);
        }

        paramString = appendUrlParam(paramString, userActionParamId, '0');
        let sizeParam = largePhoto ? 'HR96x96' : 'HR64x64';
        paramString = appendUrlParam(paramString, sizeParamId, sizeParam);
        return `${baseUrl}${serviceEndpoint}?${paramString}`;
    }
}

/**
 * Get the url for the persona photo from the Hex id
 * @param hexConsumerIdForUser Hex id of the user
 * @param size size of the persona
 */
export function getPersonaPhotoUrlFromhexCID(
    hexConsumerIdForUser: string,
    mailboxType: string,
    size: PersonaSize
) {
    if (isImageApiEnabled()) {
        return getImageUrl(hexConsumerIdForUser, mailboxType);
    } else {
        // Consumer's own profile picture
        return `https://cid-${hexConsumerIdForUser}.users.storage.live.com/users/0x${hexConsumerIdForUser}/myprofile/expressionprofile/profilephoto:${getConsumerPictureSize(
            size
        )}/MeControlMediumUserTile?ck=1&ex=24&fofoff=1`;
    }
}

function getConsumerPictureSize(size: PersonaSize): string {
    // We find the "optimal" size depending on the specified width,
    //  and specify all the smaller sizes as fallbacks.
    switch (size) {
        case PersonaSize.tiny:
        case PersonaSize.extraExtraSmall:
        case PersonaSize.extraSmall:
        case PersonaSize.small:
        case PersonaSize.regular:
        case PersonaSize.large:
        case PersonaSize.size10:
        case PersonaSize.size8:
        case PersonaSize.size16:
        case PersonaSize.size24:
        case PersonaSize.size28:
        case PersonaSize.size32:
            return 'UserTileStatic,UserTileSmall';
        case PersonaSize.extraLarge:
        case PersonaSize.size40:
        case PersonaSize.size48:
        case PersonaSize.size56:
        case PersonaSize.size72:
        case PersonaSize.size100:
        case PersonaSize.size120:
            return 'UserTileMedium,UserTileStatic,UserTileSmall';
        default:
            return assertNever(size);
    }
}

function appendUrlParam(paramString: string, paramId: string, paramValue: string): string {
    if (paramValue) {
        paramValue = encodeURIComponent(paramValue);
    }
    let newParamString = `${paramId}=${paramValue}`;
    if (paramString) {
        newParamString = `${paramString}&${newParamString}`;
    }
    return newParamString;
}
