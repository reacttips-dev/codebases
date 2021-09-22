import loadRoamingSignature from '../utils/loadRoamingSignature';
import { lazyLoadSignatureInUserOptions } from 'owa-options-message-options';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getStore } from '../store/signatureStore';
import isRoamingSignatureEnabled from './isRoamingSignatureEnabled';

export default async function loadSignature() {
    // This part use '==' is intended to cover both null case and undefined case.
    if (isRoamingSignatureEnabled()) {
        const store = getStore();
        if (store.legacySignature.html == undefined || store.legacySignature.txt == undefined) {
            return loadRoamingSignature();
        }
    } else {
        const userOptions = getUserConfiguration().UserOptions;
        if (
            userOptions &&
            (userOptions.SignatureHtml == undefined || userOptions.SignatureText == undefined)
        ) {
            return lazyLoadSignatureInUserOptions.importAndExecute();
        }
    }

    return Promise.resolve();
}
