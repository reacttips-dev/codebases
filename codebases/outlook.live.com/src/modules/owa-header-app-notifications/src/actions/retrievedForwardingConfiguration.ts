import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';

export const retrievedForwardingConfiguration = mutatorAction(
    'RETRIEVED_FORWARDING_CONFIGURATION',
    (forwardingAddress: string) => {
        getStore().forwardingNotice = {
            showForwardingNotice: true,
            forwardingAddress: forwardingAddress,
        };
    }
);
