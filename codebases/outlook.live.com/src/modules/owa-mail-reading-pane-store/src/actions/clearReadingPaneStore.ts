import { releaseOrphanedLoadedConversationViewStates } from '../mutators/loadedConversationViewStateMutators';
import { releaseOrphanedLoadedItemViewStates } from '../mutators/loadedItemViewStateMutators';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';

export default action('clearReadingPaneStore')(function clearReadingPaneStore(
    listViewType: ReactListViewType
) {
    if (listViewType === ReactListViewType.Message || shouldShowUnstackedReadingPane()) {
        releaseOrphanedLoadedItemViewStates();
    } else if (listViewType === ReactListViewType.Conversation) {
        releaseOrphanedLoadedConversationViewStates();
    }
});
