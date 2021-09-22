import { getPersonaSuggestionPillHeaderData } from './getPersonaSuggestionPillHeaderData';
import { getPrivateDistributionListSuggestionPillHeaderData } from './getPrivateDistributionListSuggestionPillHeaderData';
import type {
    FolderForestNode,
    FavoritePrivateDistributionListNode,
    FavoritePrivateDistributionListData,
} from 'owa-favorites-types';
import type { MultiPersonaHeaderData } from '../types/MultiPersonaHeaderData';
import { favoritesStore } from 'owa-favorites';

export function getMultiPersonaHeaderData(
    isSearchTable: boolean,
    tableViewId: string,
    selectedNode: FolderForestNode
): MultiPersonaHeaderData {
    if (isSearchTable) {
        // 1. PDL pill search scenario
        const pdlPill = getPrivateDistributionListSuggestionPillHeaderData(tableViewId);

        if (pdlPill) {
            return {
                displayName: pdlPill.DisplayName,
                personas: pdlPill.Members,
                pdlId: pdlPill.PdlId,
                origin: 'FavoritePDLSearch',
                owsPersonaId: pdlPill.OwsPersonaId,
            };
        }

        // 2. Multi persona pill search scenario
        const personaPills = getPersonaSuggestionPillHeaderData(tableViewId);

        if (personaPills) {
            // This is temporary way as it's not applicable for all the languages
            // Follow up task: https://msfast.visualstudio.com/FAST/_workitems/edit/251421
            const displayName = buildDisplayName(
                personaPills.map(persona => calculateFirstName(persona.DisplayName))
            );
            const personas = personaPills.map(persona => ({
                emailAddress: persona.EmailAddresses[0],
                name: persona.DisplayName,
            }));

            return {
                displayName,
                personas,
                origin: 'MultiPersonaSearch',
                owsPersonaId: null,
                pdlId: null,
            };
        }
    }

    // Use the latest info in the favoritesStore to render the header, or fallback to the selectedNode
    // If the favorite was removed
    const pdlData =
        (favoritesStore.outlookFavorites.get(
            selectedNode.id
        ) as FavoritePrivateDistributionListData) ||
        (selectedNode as FavoritePrivateDistributionListNode).data;

    if (pdlData) {
        const { members, displayName, pdlId, owsPersonaId } = pdlData;

        return {
            displayName,
            personas: members,
            pdlId,
            origin: 'FavoritePDLNodeHeader',
            owsPersonaId,
        };
    }

    return null;
}

function buildDisplayName(names: string[]): string {
    if (names.length > 2) {
        // 3 or more names - example "A, B, C and D"
        const lastIndex = names.length - 1;
        const allNamesExceptLast = names.slice(0, lastIndex).join(', ');

        return `${allNamesExceptLast} & ${names[lastIndex]}`;
    }

    if (names.length === 2) {
        return names.join(' & ');
    }

    // 1 name
    return names[0];
}

function calculateFirstName(displayName: string): string {
    let firstName = '';

    const splitted = displayName.split(' ');
    if (splitted && splitted.length > 0) {
        firstName = splitted[0];
    }

    return firstName;
}
