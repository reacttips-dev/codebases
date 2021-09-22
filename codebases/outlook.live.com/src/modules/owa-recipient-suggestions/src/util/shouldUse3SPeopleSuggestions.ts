import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';
import store from '../store/store';

export default function shouldUse3SPeopleSuggestions(): boolean {
    // 3S currently doesn't support the explicit logon scenario, so fallback to using findPeople if this is explict logon
    const userConfiguration = getUserConfiguration();
    const sessionSettings = userConfiguration?.SessionSettings;
    const isExplicitLogon = sessionSettings?.IsExplicitLogon;
    const isSubstrateSearchServiceAvailable = sessionSettings?.IsSubstrateSearchServiceAvailable;

    return !!(
        !store.fallbackToFindPeople &&
        isFeatureEnabled('rp-3SPeopleSuggestions') &&
        !isExplicitLogon &&
        isSubstrateSearchServiceAvailable
    );
}
