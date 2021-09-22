import getStore from '../store';
import { mutatorAction } from 'satcheljs';

export const setIsImmutableIdFeatureOnForConnectedAccount = mutatorAction(
    'setIsImmutableIdFeatureOnForConnectedAccount',
    (isImmutableIdFeatureOn: boolean) => {
        getStore().IsImmutableIdFeatureOnForConnectedAccount = isImmutableIdFeatureOn;
    }
);
