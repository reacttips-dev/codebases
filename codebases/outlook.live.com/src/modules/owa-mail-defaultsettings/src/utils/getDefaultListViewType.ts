import type { ReadOnlyOwaUserConfiguration } from 'owa-service/lib/ReadOnlyTypes';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function getDefaultListViewType(
    config: ReadOnlyOwaUserConfiguration
): ReactListViewType {
    if (isConsumer()) {
        const globalFolderViewState = config.ViewStateConfiguration?.GlobalFolderViewState;

        if (globalFolderViewState && !JSON.parse(globalFolderViewState).IsConversationView) {
            return ReactListViewType.Message;
        }

        return ReactListViewType.Conversation;
    }

    const folderViewState = config.ViewStateConfiguration?.FolderViewState;
    const inboxId = folderNameToId('inbox');

    // default to conversation view in case of missing info
    if (!inboxId || !folderViewState || !folderViewState.length) {
        return ReactListViewType.Conversation;
    }

    const inboxEntry = folderViewState.filter(folder => JSON.parse(folder).FolderId.Id === inboxId);

    const listViewType =
        inboxEntry?.length && inboxEntry[0] ? (<any>JSON.parse(inboxEntry[0])).View : 1;
    return listViewType === 1 ? ReactListViewType.Conversation : ReactListViewType.Message;
}
