import setRoamingSignatureInStore from '../actions/setRoamingSignatureInStore';
import setDefaultSignatureName from '../actions/setDefaultSignatureName';
import { getStore } from '../store/signatureStore';
import { getUserConfiguration } from 'owa-session-store';
import {
    saveRoamingSignature,
    saveRoamingSignatureList,
    saveDefaultRoamingSignature,
    saveDefaultReplyRoamingSignature,
} from '../service/saveRoamingSignature';
import type { SignatureBlock } from '../store/schema/SignatureStore';
import loc from 'owa-localize';
import { defaultOwaSignatureName } from './populateFirstSignature.locstring.json';

const IMAGE_URL_ELEMENT_ID = 'dataURI';
/**
 * This is the logic to migrate the existing signature to Roaming signautre
 * Logic:
 *       If the user has legacy signature then automatically populate the first
 * signature for user. This will cut over user from legacy signature system to
 * roaming signature automatically.
 */
export default function populatefirstSignature() {
    const { roamingSignatureMap, legacySignature } = getStore();
    const userOptions = getUserConfiguration().UserOptions;
    const legacySignatureHtml = legacySignature.html?.value;

    if (!legacySignatureHtml) {
        return;
    }

    const signatureHtmlAfterImageProcessing = processLegacySignatureImage(legacySignatureHtml);

    const firstSignatureHtml: SignatureBlock = {
        name: loc(defaultOwaSignatureName),
        value: signatureHtmlAfterImageProcessing,
        secondaryKey: 'htm',
    };

    // Create first HTML signature for user in OCS
    setRoamingSignatureInStore(firstSignatureHtml);

    if (legacySignature.txt?.value) {
        const firstSignatureTxt: SignatureBlock = {
            name: loc(defaultOwaSignatureName),
            value: legacySignature.txt.value,
            secondaryKey: 'txt',
        };

        // Create first Text signature for user in OCS
        setRoamingSignatureInStore(firstSignatureTxt);
    }

    saveRoamingSignature(roamingSignatureMap);
    saveRoamingSignatureList();

    if (userOptions) {
        if (userOptions.AutoAddSignature) {
            setDefaultSignatureName(loc(defaultOwaSignatureName), false /*isReply*/);
            saveDefaultRoamingSignature(loc(defaultOwaSignatureName));
        }
        if (userOptions.AutoAddSignatureOnReply) {
            setDefaultSignatureName(loc(defaultOwaSignatureName), true /*isReply*/);
            saveDefaultReplyRoamingSignature(loc(defaultOwaSignatureName));
        }
    }
}

function processLegacySignatureImage(legacySignatureHtml: string): string {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(legacySignatureHtml, 'text/html');
    const imageElements = doc.getElementsByTagName('img');
    for (let i = 0; i < imageElements.length; i++) {
        let imgEl = imageElements[i];
        if (!imgEl.currentSrc) {
            let imgUrlEl = imgEl.nextElementSibling;
            if (imgUrlEl?.id == IMAGE_URL_ELEMENT_ID) {
                if (imgUrlEl.textContent) {
                    imgEl.src = imgUrlEl.textContent;
                }
                imgEl.parentElement?.removeChild(imgUrlEl);
            }
        }
    }
    return doc.body.innerHTML;
}
