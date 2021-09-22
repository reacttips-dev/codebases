import { FolderForestNodeType, FolderForestNode, FavoritePersonaNode } from 'owa-favorites-types';
import { getStore as getMailSearchStore } from 'owa-mail-search';
import { getPersonaSuggestionPillHeaderData } from './getPersonaSuggestionPillHeaderData';
import type { HeaderPersonaData } from '../types/HeaderPersonaData';

export function getHeaderPersonaData(
    isSearchTable: boolean,
    tableViewId: string,
    selectedNode: FolderForestNode
): HeaderPersonaData {
    let personaId;
    let displayName;
    let email;
    let origin;
    let mailboxType;
    let imAddress;

    const personaNode = selectedNode as FavoritePersonaNode;

    //If we are in a search table, then display the header for the personaPill, as it will have the correct info even in the fallback case
    // Otherwise, get information from the selected node.

    if (isSearchTable) {
        const previousNode = getMailSearchStore().previousNode;
        const personaPill = getPersonaSuggestionPillHeaderData(tableViewId)[0];

        const isPreviousNodePersona =
            previousNode && previousNode.type === FolderForestNodeType.Persona;

        const pillEqualSelectedNode =
            personaNode.mainEmailAddress === personaPill.EmailAddresses[0];

        // We are in fallback search if the previous node's SF is not populated, and the pill has the same email
        const isFavoritePersonaFallbackSearch =
            personaNode.type === FolderForestNodeType.Persona &&
            !personaNode.isSearchFolderPopulated &&
            pillEqualSelectedNode;

        personaId = undefined;
        displayName = personaPill.DisplayName;
        email = personaPill.EmailAddresses[0];
        mailboxType = personaPill.MailboxType;
        imAddress = personaPill.ImAddress;

        if (isFavoritePersonaFallbackSearch) {
            origin = 'PersonaHeaderFromFallbackSearch';
        } else {
            origin =
                isPreviousNodePersona && pillEqualSelectedNode
                    ? 'PersonaHeaderFromPersonaSearch'
                    : 'PersonaHeaderFromFolderSearch';
        }
    } else {
        personaId = personaNode.personaId;
        displayName = personaNode.displayName;
        email = personaNode.mainEmailAddress;
        origin = 'PersonaHeader';
    }

    return {
        personaId,
        displayName,
        email,
        origin,
        mailboxType,
        imAddress,
    };
}
