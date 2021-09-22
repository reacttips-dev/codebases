import type ConversationQueryTraversal from 'owa-service/lib/contract/ConversationQueryTraversal';
import type { ViewFilter } from 'owa-graph-schema';

/**
 * Gets the traversal based on the view filter
 * @param viewFilter The view filter for which to get the traversal
 * @returns a traversal of type ConversationQueryTraversal
 */
export function getFindConversationTraversal(
    viewFilter: ViewFilter
): ConversationQueryTraversal | undefined {
    switch (viewFilter) {
        // case 'Hashtag' not supported
        case 'UserCategory':
            return 'Deep'; // A Deep Traversal means to fetch items from the root folder and all the sub folders

        default:
            return undefined; // A null does not work as it sends a value as null to server which does not work
    }
}
