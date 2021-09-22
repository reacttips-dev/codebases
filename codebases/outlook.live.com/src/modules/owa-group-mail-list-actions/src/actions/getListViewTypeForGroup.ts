import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Get the list view type for the Group
 */
export default function getListViewTypeForGroup(): ReactListViewType {
    // If value not set, return Conversation type.
    const globalListViewTypeReact = getUserConfiguration().UserOptions.GlobalListViewTypeReact;
    if (globalListViewTypeReact == undefined) {
        return ReactListViewType.Conversation;
    }

    // Otherwise returns the GlobalListViewTypeReact in user options
    return globalListViewTypeReact;
}
