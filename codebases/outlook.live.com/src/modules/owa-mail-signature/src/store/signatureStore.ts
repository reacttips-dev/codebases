import { ObservableMap } from 'mobx';
import type { SignatureStore, Signature } from './schema/SignatureStore';
import { createStore } from 'satcheljs';

const signatureStore: SignatureStore = {
    legacySignature: {
        html: null,
        txt: null,
    },
    roamingSignatureMap: new ObservableMap<string, Signature>(),
    defaultSignatureName: '',
    defaultReplySignatureName: '',
};

export const getStore = createStore<SignatureStore>('signature', signatureStore);

export const store = getStore();
