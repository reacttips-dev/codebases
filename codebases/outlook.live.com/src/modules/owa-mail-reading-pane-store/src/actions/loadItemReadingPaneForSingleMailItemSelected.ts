import handleCurrentlyOpenInlineCompose from './handleCurrentlyOpenInlineCompose';
import loadItemReadingPane from './loadItemReadingPane';
import setItemReadingPaneViewState from './setItemReadingPaneViewState';
import { updatePrimaryReadingPaneTabId } from '../mutators/primaryReadingPaneTabIdMutators';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import getItemReadingPaneViewState from '../utils/getItemReadingPaneViewState';
import type { ClientItemId } from 'owa-client-ids';
import { lazyLoadDraftToCompose, lazyTrySaveAndCloseCompose } from 'owa-mail-compose-actions';
import findComposeFromTab from 'owa-mail-compose-actions/lib/utils/findComposeFromTab';
import { ComposeTarget, getStore } from 'owa-mail-compose-store';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import { mailStore } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getActiveContentTab } from 'owa-tab-store';
import { action } from 'satcheljs/lib/legacy';

export interface LoadItemReadingPaneForSingleMailItemSelectedState {
    itemReadingPaneState: ItemReadingPaneViewState;
    hasItemInMailStore: boolean;
}

export default action('loadItemReadingPaneForSingleMailItemSelected')(
    async function loadItemReadingPaneForSingleMailItemSelected(
        itemId: ClientItemId,
        isUserNavigation: boolean,
        instrumentationContext: InstrumentationContext,
        shouldLoadCompose?: boolean,
        scenarioName?: string,
        state: LoadItemReadingPaneForSingleMailItemSelectedState = {
            itemReadingPaneState: getItemReadingPaneViewState(),
            hasItemInMailStore: mailStore.items.has(itemId?.Id),
        }
    ): Promise<void> {
        instrumentationContext?.dp?.addCheckpoint?.('LIRPFSMIS');
        // Skip if item id is null
        if (!itemId) {
            return;
        }
        const activeTab = getActiveContentTab();
        const composeViewState = state.itemReadingPaneState
            ? findComposeFromTab(
                  activeTab,
                  state.itemReadingPaneState.itemId,
                  ReactListViewType.Message
              )
            : null;
        if (
            (state.itemReadingPaneState &&
                state.itemReadingPaneState.itemId == itemId.Id &&
                state.itemReadingPaneState.currentSelectedFolderId ==
                    getFolderIdForSelectedNode() &&
                state.hasItemInMailStore &&
                !composeViewState) ||
            (composeViewState && !isUserNavigation)
        ) {
            // Skip in two cases:
            // 1. loading the same item in the same folder
            // 2. user has not explicitly asked (!isUserNavigation) to navigate to a different item
            return;
        }

        if (!composeViewState) {
            // Properly handle compose before loading new item to reading pane store
            // Only when the full compose view state in ComposeStore is set as null, the reading pane container
            // will be replaced with the item content.
            // If full compose has save failure, the defaultViewState in ComposeStore will not be set as null,
            // so the reading pane container still keeps the current full compose form even if it triggers
            // loadItemReadingPane action.
            const composeStore = getStore();
            const primaryComposeViewState = composeStore.viewStates.get(
                composeStore.primaryComposeId
            );
            if (primaryComposeViewState && !shouldLoadCompose) {
                await lazyTrySaveAndCloseCompose.importAndExecute(primaryComposeViewState);
            }
            // We need to double check to see if there's an inline compose open (which can only happen in conversation view -> drafts folder)
            // If there is, we need to move it to a tab immediately and clear the conversation reading pane reading pane.
            handleCurrentlyOpenInlineCompose(null);
        }
        if (shouldLoadCompose) {
            await lazyLoadDraftToCompose.importAndExecute(
                itemId.Id,
                null, // sxsId
                ComposeTarget.PrimaryReadingPane
            );
        }
        updatePrimaryReadingPaneTabId(itemId);
        return loadItemReadingPane(
            itemId,
            instrumentationContext,
            setItemReadingPaneViewState,
            false /* isPrint */,
            false /* isPreviewPane */,
            null /*isReadonly*/,
            null /*isDiscovery*/,
            scenarioName /*scenarioName*/
        );
    }
);
