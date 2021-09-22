import { getStore } from '../store/store';
import { isInitialized } from './smimeUtils';

/**
 * Returns whether S/MIME adapter has been initialized
 */
export default function isSmimeAdapterInitialized(): boolean {
    const smimeAdapterStore = getStore();
    return isInitialized(smimeAdapterStore.installationStatus);
}
