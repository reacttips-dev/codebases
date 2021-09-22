import { isFeatureEnabled } from 'owa-feature-flags';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import { isDogfoodEnv } from 'owa-metatags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import isCacheEmpty from 'owa-recipient-cache/lib/utils/isCacheEmpty';
import { FindRecipientInfoType } from 'owa-recipient-common-components/lib/components/FindRecipientInfo';
import isValidAddressWithOptionalDisplayName from 'owa-recipient-email-address/lib/utils/isValidAddressWithOptionalDisplayName';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import FindControlViewState, {
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';

export default function shouldShowHeaderFooterItem(
    infoType: FindRecipientInfoType,
    viewState: FindControlViewState
): () => boolean {
    return function (): boolean {
        switch (infoType) {
            case FindRecipientInfoType.Searching:
                return hasQueryString(viewState) && viewState.isSearching;
            case FindRecipientInfoType.TypeToSearch:
                return (
                    !hasQueryString(viewState) &&
                    isCacheEmpty() &&
                    viewState.findResultSet.length == 0
                );
            case FindRecipientInfoType.SearchDirectory:
                return (
                    hasQueryString(viewState) &&
                    !viewState.isSearching &&
                    viewState.directorySearchType == DirectorySearchType.None
                );
            case FindRecipientInfoType.TopNResults:
                return (
                    hasQueryString(viewState) &&
                    !viewState.isSearching &&
                    viewState.directorySearchType != DirectorySearchType.None
                );
            case FindRecipientInfoType.UseAddress:
                return (
                    hasQueryString(viewState) &&
                    viewState.directorySearchType != DirectorySearchType.None &&
                    viewState.findResultSet.length == 0 &&
                    isValidAddressWithOptionalDisplayName(viewState.queryString)
                );
            case FindRecipientInfoType.SuggestedContacts:
                return !hasQueryString(viewState) && viewState.findResultSet.length > 0;
            case FindRecipientInfoType.FindPeopleFeedback:
                return (
                    (isDogfoodEnv() || isFeatureEnabled('cmp-3SPeopleFeedback')) &&
                    shouldUse3SPeopleSuggestions() &&
                    isHostAppFeatureEnabled('use3SPeopleSuggestions')
                );
            default:
                return false;
        }
    };
}

let hasQueryString = (viewState: FindControlViewState) => {
    return !isStringNullOrWhiteSpace(viewState.queryString);
};
