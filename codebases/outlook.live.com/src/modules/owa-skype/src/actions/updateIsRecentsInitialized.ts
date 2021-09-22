import store from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateIsRecentsInitialized ')(function updateIsRecentsInitialized(
    isRecentsReady: boolean
) {
    store.isRecentsInitialized = isRecentsReady;
});
