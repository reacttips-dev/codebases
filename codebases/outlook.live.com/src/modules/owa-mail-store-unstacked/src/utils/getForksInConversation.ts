import checkForLocalItemIds from './checkForLocalItemIds';
import { getConversationItemsRelationMap } from './conversationRelationMapUtils';
import { addForkItemToMailStore } from '../mutators/addForkItemToMailStore';
import { GetConversationForksByIdDocument } from '../queries/__generated__/GetConversationForkByID.interface';
import type ParentChildRelation from '../schema/ParentChildRelation';
import { getApolloClient } from 'owa-apollo';
import type { MailboxInfo } from 'owa-client-ids';
import type { ConversationFork } from 'owa-graph-schema';
import isHxForksEnabled from './isHxForksEnabled';

/**
 * This function is used to get the local leaf nodes from conversation tree
 */
async function getForksInConversation(
    conversationId: string,
    parentFolderId: string,
    mailboxInfo: MailboxInfo
): Promise<ConversationFork[]> {
    let forkIds: ConversationFork[] = [];
    if (isHxForksEnabled()) {
        try {
            forkIds = await getForksViaGql(conversationId, parentFolderId, mailboxInfo);
        } catch (e) {
            forkIds = [];
        }
    } else {
        forkIds = await getForksWeb(
            conversationId,
            parentFolderId,
            mailboxInfo?.type == 'GroupMailbox'
        );
    }

    return forkIds;
}

async function getForksWeb(
    conversationId: string,
    parentFolderId: string,
    isGroupMailBox: boolean
): Promise<ConversationFork[]> {
    const conversationRelationMap = await getConversationItemsRelationMap(conversationId);

    if (conversationRelationMap) {
        const forks: ConversationFork[] = [];
        conversationRelationMap.forEach(relation => {
            // If it does not have any children then it is a leaf node
            if (relation.childrenImIds.length === 0) {
                if (isGroupMailBox) {
                    // For group mailbox, parentFolderId returned by GCI is different from the one obtained from
                    // tableView. Also, user can only reply all on group mailbox. We need to skip checking for local item.
                    forks.unshift({
                        id: relation.itemIds[0],
                        displayNames: [], // TODO replace with display names
                        forkId: '', // TODO replace with forkId obtained from hx fork
                        ancestorIds: [], // TODO replace with ancestor ids
                    });
                } else {
                    let localItemId = checkForLocalItemIds(relation.itemIds, parentFolderId);
                    localItemId &&
                        forks.unshift({
                            id: localItemId,
                            displayNames: [], // TODO replace with display names
                            forkId: '', // TODO replace with forkId obtained from hx fork
                            ancestorIds: [], // TODO replace with ancestor ids
                        });
                    let currentRelation: ParentChildRelation | undefined = relation;
                    // If the latest local item id is not in the first node, look at the parents
                    while (!localItemId && currentRelation?.parentImId) {
                        currentRelation = conversationRelationMap.get(currentRelation?.parentImId);
                        localItemId = checkForLocalItemIds(
                            currentRelation?.itemIds,
                            parentFolderId
                        );
                        localItemId &&
                            forks.unshift({
                                id: localItemId,
                                displayNames: [], // TODO replace with display names
                                forkId: '', // TODO replace with forkId obtained from hx fork
                                ancestorIds: [], // TODO replace with ancestor ids
                            });
                    }
                }
            }
        });

        return forks;
    }
    return [];
}

async function getForksViaGql(
    conversationId: string,
    parentFolderId: string,
    mailboxInfo: MailboxInfo
): Promise<ConversationFork[]> {
    const client = getApolloClient();

    const conversationForksResponse = await client?.query({
        query: GetConversationForksByIdDocument,
        variables: {
            id: conversationId,
            folderId: parentFolderId,
        },
        context: {
            suppressFallbackAlert: true,
        },
    });

    if (
        conversationForksResponse?.data?.conversationForks?.forks &&
        conversationForksResponse.data.conversationForks.forks.length > 0
    ) {
        let forks: ConversationFork[] = [];

        conversationForksResponse.data.conversationForks.forks.forEach(fork => {
            forks.push(fork as ConversationFork);
            addForkItemToMailStore(fork as ConversationFork, mailboxInfo);
        });
        return forks;
    }

    return [];
}

export default getForksInConversation;
