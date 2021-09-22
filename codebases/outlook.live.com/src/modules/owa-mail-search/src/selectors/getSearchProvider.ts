import { getStore } from '../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { SearchScopeKind, SearchProvider } from 'owa-search-service';
import is3SServiceAvailable from 'owa-search/lib/utils/is3SServiceAvailable';
import { getUserConfiguration } from 'owa-session-store';

export default function getSearchProvider(): SearchProvider {
    const { staticSearchScope: scope } = getStore();
    const scopeKind = scope?.kind;

    if (scopeKind === SearchScopeKind.SharedFolders || scopeKind === SearchScopeKind.PublicFolder) {
        return SearchProvider.FindItem;
    }

    if (getUserConfiguration().SessionSettings.IsExplicitLogon) {
        if (scopeKind === SearchScopeKind.ArchiveMailbox) {
            return SearchProvider.FindItem;
        } else {
            return isFeatureEnabled('sea-3s-explicitLogon') &&
                scopeKind === SearchScopeKind.PrimaryMailbox &&
                is3SServiceAvailable()
                ? SearchProvider.Substrate
                : SearchProvider.ExecuteSearch;
        }
    }

    /**
     * Key off of the staticSearchScope (as defined in the store) to determine
     * which search provider to use. This is determined by whether or not 3S
     * supports the given scenario.
     */
    if (scopeKind === SearchScopeKind.PrimaryMailbox) {
        return is3SServiceAvailable()
            ? isFeatureEnabled('sea-v23sQueryApi2') && !isFeatureEnabled('sea-v13sQueryApiHoldback')
                ? SearchProvider.SubstrateV2
                : SearchProvider.Substrate
            : SearchProvider.ExecuteSearch;
    } else if (scopeKind === SearchScopeKind.ArchiveMailbox) {
        return isFeatureEnabled('sea-archive-mailbox-3S-2') && is3SServiceAvailable()
            ? SearchProvider.Substrate
            : SearchProvider.ExecuteSearch;
    } else if (scopeKind === SearchScopeKind.Group) {
        return SearchProvider.ExecuteSearch;
    }

    return null;
}
