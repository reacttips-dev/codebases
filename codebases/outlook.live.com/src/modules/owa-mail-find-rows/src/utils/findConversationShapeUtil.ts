import type ConversationResponseShape from 'owa-service/lib/contract/ConversationResponseShape';
import conversationResponseShape from 'owa-service/lib/factory/conversationResponseShape';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import propertyUri from 'owa-service/lib/factory/propertyUri';

export const FindConversationShapeName: string = 'ReactConversationListView';
const FindConversationSentItemsShapeName: string = 'ReactConversationSentItemsListView';
const FindConversationSearchFolderListView: string = 'ReactFindConversationSearchFolderListView';
/**
 * Gets find conversation response shape.
 * @returns The ConversationResponseShape
 */
export function getFindConversationResponseShape(folderId?: string): ConversationResponseShape {
    // If we are in the scheduled folder, additionally request ReturnTime
    if (folderId && folderIdToName(folderId) == 'scheduled') {
        return conversationResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [
                propertyUri({ FieldURI: 'ConversationReturnTime' }),
                propertyUri({ FieldURI: 'ConversationHashtags' }),
            ],
        });
    }
    return conversationResponseShape({ BaseShape: 'IdOnly' });
}

/**
 * Gets find conversation shape name based on the folder. The FindConversationSentItemsShapeName
 * shape gives back recipients whereas the ReactConversationListView gives back senders.
 * FindConversationSearchFolderListView gives the parent folder id for the conversation view.
 * @param folderId the folder for which we are going to do findConversation
 * @param isFavoritesSearchFolderScenario boolean true if scenario type is of favorites
 * @returns the shape name
 */
export function getFindConversationShape(
    folderId: string,
    isFavoritesSearchFolderScenario: boolean
): string {
    if (folderIdToName(folderId) == 'sentitems' || folderIdToName(folderId) == 'drafts') {
        return FindConversationSentItemsShapeName;
    } else if (isFavoritesSearchFolderScenario) {
        return FindConversationSearchFolderListView;
    }
    return FindConversationShapeName;
}
