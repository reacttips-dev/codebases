import {
    FIREBASE_AUTH_CLIENT_ID
} from '../../env';

let clientPromise = null;
let authChangeListeners = [];

export function getToken(gapi) {
    const auth = gapi.auth2.getAuthInstance();
    const isSignedIn = auth.isSignedIn.get();
    return isSignedIn ? auth.currentUser.get().getAuthResponse().access_token : null;
}

export function onAuthChange(cb) {
    authChangeListeners.push(cb);
    return () => {
        authChangeListeners = authChangeListeners.filter((listener) => listener !== cb);
    };
}

function loadClient() {
    return new Promise((resolve, reject) => {
        /* global gapi */
        gapi.load('client', {
            callback: () => resolve(gapi),
            onerror: reject,
            timeout: 30 * 1000,
            ontimeout: reject,
        });
    });
}

async function initClient(gapi) {
    await gapi.client.init({
        clientId: FIREBASE_AUTH_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',
    });
}

function establishListeners(gapi) {
    const auth = gapi.auth2.getAuthInstance();
    const callback = () => {
        const token = getToken(gapi);
        authChangeListeners.forEach((cb) => cb(token));
    };
    auth.isSignedIn.listen(callback);
}

async function buildClient() {
    const gapi = await loadClient();
    await initClient(gapi);
    establishListeners(gapi);
    return gapi;
}

export function getClient() {
    if (clientPromise === null) {
        clientPromise = buildClient();
    }
    return clientPromise;
}