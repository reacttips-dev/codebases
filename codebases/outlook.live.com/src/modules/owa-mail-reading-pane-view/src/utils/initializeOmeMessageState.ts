import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyGetItemProperties } from 'owa-get-item-manager';
import { setOmeMessageStateOnItemViewState } from 'owa-mail-reading-pane-store/lib/actions/setOmeMessageStateOnItemViewState';
import type ItemViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemViewState';
import getInitialOmeMessageState, {
    revocationFeatureName,
    sentItemsFolder,
} from 'owa-mail-revocation/lib/utils/getInitialOmeMessageState';
import type ClientItem from 'owa-mail-store/lib/store/schema/ClientItem';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

export default function initializeOmeMessageState(item: ClientItem, itemViewState: ItemViewState) {
    if (
        isFeatureEnabled(revocationFeatureName) &&
        item?.ParentFolderId.Id === folderNameToId(sentItemsFolder)
    ) {
        lazyGetItemProperties.import().then(getItemProperties => {
            getItemProperties(item.ItemId.Id, revocationFeatureName).then(updatedItem => {
                const parsedOmeMessageState = getInitialOmeMessageState(updatedItem);
                setOmeMessageStateOnItemViewState(itemViewState, parsedOmeMessageState);
            });
        });
    }
}
