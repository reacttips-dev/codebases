import store from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateIsSwcInitialized ')(function updateIsSwcInitialized(
    isSwcReady: boolean
) {
    store.isSwcInitialized = isSwcReady;
});
