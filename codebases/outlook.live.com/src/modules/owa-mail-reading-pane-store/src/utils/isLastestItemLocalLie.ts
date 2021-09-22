import { LocalLieState } from 'owa-mail-store/lib/store/schema/LocalLieState';
import mailStore from 'owa-mail-store/lib/store/Store';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';

/**
 * Checks if latest message in conversation is a local lie
 */
export default function isLastestItemLocalLie(conversationId: string): boolean {
    const conversationNodeIds = mailStore.conversations?.get(conversationId)?.conversationNodeIds;
    const conversationNodesCount = conversationNodeIds?.length;
    if (!conversationNodesCount || conversationNodesCount === 0) {
        return false;
    }
    const nodeId = isNewestOnBottom()
        ? conversationNodeIds[conversationNodesCount - 1]
        : conversationNodeIds[0];
    const conversationNode = mailStore.conversationNodes?.get(nodeId);
    return conversationNode?.localLieState === LocalLieState.Pending;
}
