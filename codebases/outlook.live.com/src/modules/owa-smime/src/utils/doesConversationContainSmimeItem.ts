import type { ConversationType } from 'owa-graph-schema';
import { ITEM_CLASS_SMIME } from 'owa-smime-adapter/lib/utils/bootConstants';

/**
 * Returns true if the conversation contains S/MIME item
 */
export default function doesConversationContainSmimeItem(
    conversation: Partial<ConversationType>
): boolean {
    return (
        conversation?.ItemClasses &&
        conversation.ItemClasses.length > 0 &&
        conversation.ItemClasses.some(itemClass => itemClass.indexOf(ITEM_CLASS_SMIME) === 0)
    );
}
