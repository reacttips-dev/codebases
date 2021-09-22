import type SsoApiMethodCallback from '../schema/SsoApiMethodCallback';

let storedCallback: SsoApiMethodCallback = null;

export function setActiveSsoCallback(callback: SsoApiMethodCallback) {
    storedCallback = callback;
}

export function getActiveSsoCallback(): SsoApiMethodCallback {
    return storedCallback;
}
