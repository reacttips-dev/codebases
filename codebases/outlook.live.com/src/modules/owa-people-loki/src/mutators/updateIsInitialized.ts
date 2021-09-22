import { mutatorAction } from 'satcheljs';
import store from '../store/store';

export const updateIsInitialized = mutatorAction(
    'UPDATE_LOKI_IS_INITIALIZED',
    function updateIsInitialized(isInitialized: boolean) {
        store.isInitialized = isInitialized;
    }
);

export default updateIsInitialized;
