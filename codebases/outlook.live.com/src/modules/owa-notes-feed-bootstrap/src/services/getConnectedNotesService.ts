import { getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';
import { createRequestQueue, RequestQueue } from 'owa-service-utils';
import { isFeatureEnabled } from 'owa-feature-flags';
import { format } from 'owa-localize';

const MAXIMUM_NUM_REQUESTS = 1;
let requestQueue: RequestQueue = null;

const CONNECTED_NOTES_ENDPOINT = '/{0}/api/v2.0/me/connectednotes';
const NOTES_SERVICE = 'NotesClient';
const NOTES_B2_SERVICE = 'NotesClientB2';
const NOTES_MICROREPO_SERVICE = 'NotesFabric';

function getConnectedNotesEndpoint(): string {
    let serviceName = NOTES_SERVICE;
    if (isFeatureEnabled('notes-B2Endpoint')) {
        serviceName = NOTES_B2_SERVICE;
    }

    if (isFeatureEnabled('notes-microRepoEndpoint')) {
        serviceName = NOTES_MICROREPO_SERVICE;
    }

    return format(CONNECTED_NOTES_ENDPOINT, serviceName);
}

export default async function getConnectedNotesService() {
    let [token, tokenPromise] = getAccessTokenforResourceAsLazy(
        window.location.origin,
        'OwaNotesFeedBootstrap'
    );
    // If token is not returned synchronously, we need to await on the tokenPromise
    if (!token) {
        token = await tokenPromise;
    }

    if (!requestQueue) {
        requestQueue = createRequestQueue(MAXIMUM_NUM_REQUESTS);
    }

    return requestQueue.add(() =>
        fetch(getConnectedNotesEndpoint(), {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
    );
}
