import { mutatorAction } from 'satcheljs';
import type { SignatureBlock } from '../store/schema/SignatureStore';
import { getStore } from '../store/signatureStore';

export default mutatorAction(
    'setLegacySignatureInStore',
    (signatureType: string, signature: SignatureBlock) => {
        if (signatureType == 'html') {
            getStore().legacySignature.html = signature;
        } else if (signatureType == 'txt') {
            getStore().legacySignature.txt = signature;
        }
    }
);
