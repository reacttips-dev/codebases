import { mutatorAction } from 'satcheljs';
import type { SignatureBlock } from '../store/schema/SignatureStore';
import { getStore } from '../store/signatureStore';

export default mutatorAction('setRoamingSignatureInStore', (signature: SignatureBlock) => {
    const { roamingSignatureMap } = getStore();
    if (signature.secondaryKey == 'htm') {
        let roamingSignature = roamingSignatureMap.get(signature.name);
        if (roamingSignature) {
            roamingSignature.html = signature;
        } else {
            roamingSignature = { html: signature, txt: null };
        }
        roamingSignatureMap.set(signature.name, roamingSignature);
    } else if (signature.secondaryKey == 'txt') {
        let roamingSignature = roamingSignatureMap.get(signature.name);
        if (roamingSignature) {
            roamingSignature.txt = signature;
        } else {
            roamingSignature = { html: null, txt: signature };
        }
        roamingSignatureMap.set(signature.name, roamingSignature);
    }
});
