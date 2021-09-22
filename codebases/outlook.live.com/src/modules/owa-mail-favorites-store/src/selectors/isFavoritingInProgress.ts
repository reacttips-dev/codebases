import { getStore } from '../store/store';
import { isOutlookFavoritingInProgress } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function isFavoritingInProgress(key: string) {
    // This is a perf optimization. If the pending map contains key, which means the favorite search folder is added in the same session
    // when user clicks on it, most likely we are still in the process of creating search folder, so we will populate search results for faster
    // performance reason.
    return isFeatureEnabled('tri-favorites-roaming')
        ? isOutlookFavoritingInProgress(key)
        : getStore().isFavoritingInProgress.get(key) === true;
}
