import initializeExtendedCardForItemReadingPane from '../actions/initializeExtendedCardForItemReadingPane';
import initializeTxpCardInItemView from '../utils/initializeTxpCardInItemView';
import initializeYammerCard from '../utils/initializeYammerCard';
import isMessageYammerThread from '../utils/isMessageYammerThread';
import { logUsage } from 'owa-analytics';
import isYammerEnabled from 'owa-mail-store-actions/lib/utils/isYammerEnabled';
import { createLazyOrchestrator } from 'owa-bundling';

/**
 * This is where we decide which card to initialize on top of the item reading pane.
 * If you have a new scenario please decide on the priority of the card before adding to this function
 *
 * Current priority:
 *
 * 1. TXP
 * 2. Yammer
 */
export const initializeExtendedCardForItemReadingPaneOrchestrator = createLazyOrchestrator(
    initializeExtendedCardForItemReadingPane,
    'initializeExtendedCardForItemReadingPaneClone',
    actionMessage => {
        const { itemReadingPaneViewState, loadedItem } = actionMessage;

        if (loadedItem?.EntityNamesMap) {
            // Initialize TXP
            initializeTxpCardInItemView(itemReadingPaneViewState, loadedItem);
            return;
        }

        if (isMessageYammerThread(loadedItem)) {
            const yammerEnabled = isYammerEnabled();
            logUsage(
                'Yammer_ThreadLoaded',
                {
                    yammerEnabled: yammerEnabled,
                    isConversation: false,
                },
                { logEvery: 1 }
            );
            if (yammerEnabled) {
                initializeYammerCard(itemReadingPaneViewState, loadedItem);
                return;
            }
        }
    }
);
