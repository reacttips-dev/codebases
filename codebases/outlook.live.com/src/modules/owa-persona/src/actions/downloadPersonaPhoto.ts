import setIsPendingFetch from './setIsPendingFetch';
import addBrandToDynamicBrandSet from './addBrandToDynamicBrandSet';
import type PersonaControlViewState from '../store/schema/PersonaControlViewState';
import getImageUrl from '../utils/getImageUrl';
import getPersonaPhotoUrl from '../utils/getPersonaPhotoUrl';
import isImageApiEnabled, { shouldUseImageApi } from '../utils/isImageApiEnabled';
import { logVerboseUsage, VerboseDatapoint } from 'owa-analytics';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import { getDelegationTokenForOwa } from 'owa-tokenprovider';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import throttledFetch from 'owa-service/lib/throttledFetch';
import createFetchOptions from 'owa-service/lib/createFetchOptions';
import { isFeatureEnabled } from 'owa-feature-flags';

const MIN_BLOB_SIZE: number = 100;
const GET_PROFILE_IMAGE_TIME = 'GetProfileImageTime';
const GET_PERSONA_TIME = 'GetPersonaTime';
const GET_PROFILE_IMAGE_NO_PHOTO = 'GetProfileImageNoPhoto';
const GET_PERSONA_NO_PHOTO = 'GetPersonaResponseNoPhoto';
const IAPI_TOKEN_SCOPE: string = 'https://outlook.office.com/M365.Access';

/**
 * Header on responses from ImageAPI when something is a thing
 */
const BRAND_VERIFIED_HEADER_NAME = 'image_verified_flag';
const BRAND_VERIFIED_HEADER_KEY = 'outlook.brands.verified_status';

let personaPhotoEntries: { [blobUrl: string]: boolean } = {};

/**
 * Downloads the persona photo
 * @param personaViewState the view state for the persona
 * @param forceFetch If true, downloads the photo using Cache-Control:no-cache header to avoid browser cache
 * @param skipLoadingPhoto Callback to check if photo should not be loaded. Used to avoid loading queued photos no longer of interest
 */
export default async function downloadPersonaPhoto(
    personaViewState: PersonaControlViewState,
    forceFetch?: boolean,
    skipLoadingPhoto?: () => boolean
) {
    const personaBlob = personaViewState.personaBlob;

    if (!forceFetch) {
        // Do not proceed if
        // 1. The request is pending
        // 2. The request had failed (some users don't have photos).
        // 3. Browser has cached photo for it.
        // 4. Email is undefined/null or empty
        // 5. The photo should not be loaded
        if (
            personaBlob.isPendingFetch ||
            personaBlob.hasFetchFailed ||
            (personaBlob.blobUrl && personaPhotoEntries[personaBlob.blobUrl]) ||
            (isStringNullOrWhiteSpace(personaViewState.emailAddress) &&
                isStringNullOrWhiteSpace(personaViewState.personaId)) ||
            skipLoadingPhoto?.()
        ) {
            return;
        }
    }

    setIsPendingFetch(personaViewState, true /* isPendingFetch */);
    try {
        //Image API does not support fetching photo for contact personaId
        await (isImageApiEnabled() &&
        shouldUseImageApi(personaViewState.personaId, personaViewState.emailAddress)
            ? downloadProfileImageFromImageAPI(personaViewState, forceFetch)
            : downloadProfilePhotoFromSubstrate(personaViewState, forceFetch));
    } catch (error) {
        // We see [The download of the specified resource has failed.] exception for some personas in IE.
        // Till we figure out the root cause we need to catch this exception
        // VSO 17536 - https://outlookweb.visualstudio.com/Outlook%20Web/_workitems?id=17536
        trace.warn(`Error in getPersonaPhoto ${error}`);
        throw error;
    } finally {
        setIsPendingFetch(personaViewState, false /* isPendingFetch */);
    }
}

async function downloadProfilePhotoFromSubstrate(
    personaViewState: PersonaControlViewState,
    forceFetch?: boolean
): Promise<void> {
    const getPersonaDatapoint = getDatapoint();
    const headers = new Headers();
    if (forceFetch) {
        headers.append('Cache-Control', 'no-cache');
    }

    // Use createFetchOptions from owa-service to use the
    // owa-service managed fetch options
    const fetchOptions = await createFetchOptions({
        isUserActivity: false,
        returnFullResponseOnSuccess: true,
        headers,
        method: 'GET',
    });
    // createFetchOptions forces credentials: include in the request. We don't want those credentials
    // to be forwarded to the linkedin cdn on redirect.
    //
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials
    fetchOptions.credentials = 'same-origin';

    // HACK 59521 remove extra headers to mitigate linkedin's server not
    // handling OPTIONS cors requests successfully
    if (fetchOptions.headers.has('X-OWA-CANARY')) {
        fetchOptions.headers.delete('X-OWA-CANARY');
    }
    if (fetchOptions.headers.has('X-Req-Source')) {
        fetchOptions.headers.delete('X-Req-Source');
    }

    // Can't just use makeServiceRequest, because getServiceRequest is proxied through
    // some other servers which discard request body /headers. Instead, we ensure the
    // parameters are in the url (see getPersonaPhotoUrl).
    const response = await throttledFetch(
        getPersonaPhotoUrl(personaViewState.emailAddress, personaViewState.personaId),
        fetchOptions
    );

    processGetPhotoResponse(personaViewState, await response.blob());
    getPersonaDatapoint.end();
}

async function downloadProfileImageFromImageAPI(
    personaViewState: PersonaControlViewState,
    forceFetch?: boolean
): Promise<void> {
    const token = await getDelegationTokenForOwa(IAPI_TOKEN_SCOPE);
    if (!token) {
        // VSO 45906: token may return null for the first few requests
        // If the token has not returned, just return
        return;
    }

    const photoUrl = getImageUrl(personaViewState.emailAddress, personaViewState.mailboxType);

    let headers = {
        'Content-Type': 'image/gif',
        Authorization: `Bearer ${token}`,
        'X-AnchorMailbox': personaViewState.emailAddress,
        image_verified_flag: '',
        'X-RoutingParameter-ResolutionDepth': 'Shallow', // VSO: 84147 Enable shallow lookup due to long AD lookups causing traffic issues
    };

    if (forceFetch) {
        headers['Cache-Control'] = 'no-cache';
    }

    const getPersonaDatapoint = getDatapoint();
    const response = await fetch(photoUrl, {
        method: 'GET',
        mode: 'cors',
        headers: headers,
    });

    // Add brands to the brands store based on headers
    if (isImageApiEnabled() && isFeatureEnabled('rp-brandCards')) {
        addBrandFromImageApiHeader(personaViewState, response);
    }

    const responseBlob = await response.blob();

    processGetPhotoResponse(personaViewState, responseBlob);
    getPersonaDatapoint.end();
}

function getDatapoint(): VerboseDatapoint {
    const datapointName = isImageApiEnabled() ? GET_PROFILE_IMAGE_TIME : GET_PERSONA_TIME;
    return new VerboseDatapoint(datapointName);
}

/**
 * Processes the XHR response from getPersonaPhoto
 * @param personaViewState the view state for the persona control
 * @param getPersonaRequest the XHR request for the get persona
 */
let processGetPhotoResponse = action('processGetPhotoResponse')(function processGetPhotoResponse(
    personaViewState: PersonaControlViewState,
    responseBlob: Blob
) {
    // VSO - 183944 - track requests that are taking longer and the time
    setIsPendingFetch(personaViewState, false /* isPendingFetch */);

    const isImage = responseBlob.type.toLowerCase().indexOf('image') == 0;

    // Images from Exchange OnPrem may be served as text/xml content type
    const isTextXml = responseBlob.type.toLowerCase().indexOf('text/xml') == 0;

    const isTooSmall = responseBlob.size < MIN_BLOB_SIZE;
    if ((isImage || isTextXml) && !isTooSmall) {
        // Create URL for the image data blob
        personaViewState.personaBlob.blobUrl = URL.createObjectURL(responseBlob);

        // Bookkeeping all the persona photos browser has cached.
        personaPhotoEntries[personaViewState.personaBlob.blobUrl] = true;
        personaViewState.personaBlob.hasFetchFailed = false;
        return;
    } else {
        logNoPhoto();
    }

    personaViewState.personaBlob.hasFetchFailed = true;
});

function logNoPhoto(): void {
    const eventName = isImageApiEnabled() ? GET_PROFILE_IMAGE_NO_PHOTO : GET_PERSONA_NO_PHOTO;

    logVerboseUsage(eventName);
}

function addBrandFromImageApiHeader(
    personaViewState: PersonaControlViewState,
    response: Response
): void {
    const imageVerifiedFlag = response.headers.get(BRAND_VERIFIED_HEADER_NAME);
    if (imageVerifiedFlag != null) {
        const imageVerifiedFlagLowerCase = imageVerifiedFlag.toLowerCase();
        const isBrand = imageVerifiedFlagLowerCase.indexOf(BRAND_VERIFIED_HEADER_KEY) !== -1;
        const isVerifiedBrand =
            imageVerifiedFlagLowerCase.indexOf(`${BRAND_VERIFIED_HEADER_KEY} = true`) !== -1;

        if (isBrand) {
            addBrandToDynamicBrandSet(personaViewState.emailAddress, isVerifiedBrand);
        }
    }
}
