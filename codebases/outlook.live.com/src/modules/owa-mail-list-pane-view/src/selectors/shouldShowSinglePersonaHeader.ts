import { getPersonaSuggestionPillHeaderData } from './getPersonaSuggestionPillHeaderData';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';

// 1.) Search scenario: render the header if a single persona pill is present in the store.
//     - This covers both the cases when a suggestion was chosen, or a search is being performed in a persona folder
// 2.) Favorite persona scenario: Favorite persona is selected and we are showing emails from persona search folder
export function shouldShowSinglePersonaHeader(
    isSearchTable: boolean,
    tableViewId: string | undefined,
    selectedNode: FolderForestNode
): boolean {
    if (isSearchTable) {
        const personaPills = getPersonaSuggestionPillHeaderData(tableViewId);
        return personaPills && personaPills.length === 1;
    }

    return selectedNode.type === FolderForestNodeType.Persona;
}
