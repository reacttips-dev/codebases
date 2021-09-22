import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';

/**
 * Sets whether display ads are enabled in current session
 * @param areDisplayAdsEnabled boolean
 */
export default mutatorAction('setAreDisplayAdsEnabled', (areDisplayAdsEnabled: boolean) => {
    getStore().areDisplayAdsEnabled = areDisplayAdsEnabled;
});
