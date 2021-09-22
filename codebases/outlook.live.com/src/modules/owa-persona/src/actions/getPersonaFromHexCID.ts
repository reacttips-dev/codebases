import type PersonaBlob from '../store/schema/PersonaBlob';
import type PersonaControlViewState from '../store/schema/PersonaControlViewState';
import { getPersonaPhotoUrlFromhexCID } from '../utils/getPersonaPhotoUrl';
import { action } from 'satcheljs/lib/legacy';

const MIN_PHOTO_DIMENSION: number = 5;

function cleanUpPersonaPseudoFetch(personaBlob: PersonaBlob, loadingElement: HTMLImageElement) {
    personaBlob.isPendingFetch = false;
    document.body.removeChild(loadingElement);
}

let onConsumerPhotoLoad = action('onConsumerPhotoLoad')(function onConsumerPhotoLoad(
    photoUrl: string,
    personaBlob: PersonaBlob,
    loadingElement: HTMLImageElement
) {
    personaBlob.hasFetchFailed =
        loadingElement.width < MIN_PHOTO_DIMENSION || loadingElement.height < MIN_PHOTO_DIMENSION;
    personaBlob.blobUrl = personaBlob.hasFetchFailed ? null : photoUrl;
    cleanUpPersonaPseudoFetch(personaBlob, loadingElement);
});

let onConsumerPhotoError = action('onConsumerPhotoError')(function onConsumerPhotoError(
    personaBlob: PersonaBlob,
    loadingElement: HTMLImageElement
) {
    personaBlob.hasFetchFailed = true;
    cleanUpPersonaPseudoFetch(personaBlob, loadingElement);
});

/**
 * Gets persona photo from hex consumer id
 * @param personaViewState the viewState for persona
 */
export default function getPersonaFromHexCID(personaViewState: PersonaControlViewState) {
    let personaBlob = personaViewState.personaBlob;

    // If it already has a pending request or has failed before, simply return.
    // No need to keep re-trying on the failed ones, since some users don't have photos.
    if (personaBlob.isPendingFetch || personaBlob.hasFetchFailed) {
        return;
    }

    let photoUrl = getPersonaPhotoUrlFromhexCID(
        personaViewState.hexConsumerIdForUser,
        personaViewState.mailboxType,
        personaViewState.size
    );

    // Handle a consumer user's own persona photo
    // This is a horrible hack, because the OneDrive url will return a 1x1 gif if no photo is set,
    // and the lack of CORS headers prevents us from using fetch/XHR in the same way as enterprise
    let consumerPersonaImg = document.createElement('img');
    consumerPersonaImg.src = photoUrl;
    consumerPersonaImg.onload = () =>
        onConsumerPhotoLoad(photoUrl, personaBlob, consumerPersonaImg);
    consumerPersonaImg.onerror = () => onConsumerPhotoError(personaBlob, consumerPersonaImg);
    consumerPersonaImg.style.visibility = 'hidden';
    document.body.appendChild(consumerPersonaImg);
}
