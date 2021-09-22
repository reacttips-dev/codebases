import { isFeatureEnabled } from 'owa-feature-flags';
import { isDataProviderAvailable } from 'owa-fileprovider-store/lib/utils/isDataProviderAvailable';

export default function isSonoraPluginFileSuggestionsEnabled(): boolean {
    return isFeatureEnabled('honeybee-sonora-file') && isDataProviderAvailable(false);
}
