import { getCategoryNameFromId, getMasterCategoryList } from 'owa-categories';
import { folderForestStore } from 'owa-mail-folder-forest-store';
import {
    FolderForestNode,
    FavoritePersonaNode,
    FavoriteCategoryNode,
    FolderForestNodeType,
    FavoritePrivateDistributionListNode,
} from 'owa-favorites-types';
import {
    CategorySearchSuggestion,
    PeopleSuggestion,
    PrivateDistributionListSuggestion,
    SuggestionKind,
    PillSuggestion,
} from 'owa-search-service';

/**
 * Creates a PillSuggestion from the currently selected node, if said node is
 * a FavoritePersonaNode or FavoriteCategoryNode. Otherwise, this function
 * returns null.
 */
export default function getSuggestionPillFromSelectedNode(): PillSuggestion {
    const selectedNode: FolderForestNode = folderForestStore.selectedNode;

    switch (selectedNode.type) {
        case FolderForestNodeType.Persona: {
            const personaNode = selectedNode as FavoritePersonaNode;
            const personaPill: PeopleSuggestion = {
                DisplayName: personaNode.displayName,
                EmailAddresses: personaNode.allEmailAddresses,
                kind: SuggestionKind.People,
                ReferenceId: personaNode.id,
                PeopleFavorite: true,
            } as PeopleSuggestion;

            return personaPill;
        }
        case FolderForestNodeType.PrivateDistributionList: {
            const pdlNode = selectedNode as FavoritePrivateDistributionListNode;
            const pdlPill: PrivateDistributionListSuggestion = {
                DisplayName: pdlNode.data.displayName,
                PdlId: pdlNode.data.pdlId,
                OwsPersonaId: pdlNode.data.owsPersonaId,
                Members: pdlNode.data.members,
                kind: SuggestionKind.PrivateDistributionList,
                ReferenceId: pdlNode.id,
            } as PrivateDistributionListSuggestion;

            return pdlPill;
        }
        case FolderForestNodeType.Category: {
            const categoryNode = selectedNode as FavoriteCategoryNode;
            const categoryId = categoryNode.id;
            const categoryName = getCategoryNameFromId(categoryId, getMasterCategoryList());
            const categoryPill: CategorySearchSuggestion = {
                Name: categoryName,
                kind: SuggestionKind.Category,
                ReferenceId: categoryId,
            } as CategorySearchSuggestion;

            return categoryPill;
        }
        default:
            return null;
    }
}
