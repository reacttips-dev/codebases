import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/signatureStore';

export default mutatorAction('setDefaultSignatureName', (signatureName, isReply) => {
    if (isReply) {
        getStore().defaultReplySignatureName = signatureName;
    } else {
        getStore().defaultSignatureName = signatureName;
    }
});
