import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function isModernFilesEnabled() {
    return isFeatureEnabled('sea-modernFileSuggestions') && !isConsumer();
}
