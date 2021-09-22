import { getPersonaSuggestionPillHeaderData } from './getPersonaSuggestionPillHeaderData';
import { getPrivateDistributionListSuggestionPillHeaderData } from './getPrivateDistributionListSuggestionPillHeaderData';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import { isFeatureEnabled } from 'owa-feature-flags';

// 1.) Search scenario: render the header if a more than one persona pills are present in the store.
// 2.) Favorite PDL scenario: Favorite PDL is selected and we are showing emails from persona search folder
export function shouldShowMultiPersonaHeader(
    isSearchTable: boolean,
    tableViewId: string | undefined,
    selectedNode: FolderForestNode
): boolean {
    if (!isFeatureEnabled('peo-favoritePdls')) {
        return false;
    }

    if (isSearchTable) {
        const personaPills = getPersonaSuggestionPillHeaderData(tableViewId);
        const pdlPill = getPrivateDistributionListSuggestionPillHeaderData(tableViewId);
        return (personaPills && personaPills.length > 1) || pdlPill !== null;
    }

    return selectedNode.type === FolderForestNodeType.PrivateDistributionList;
}
