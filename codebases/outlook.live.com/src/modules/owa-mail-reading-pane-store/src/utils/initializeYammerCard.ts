import setExtendedCardViewState from '../actions/setExtendedCardViewState';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import isMessageYammerThread from '../utils/isMessageYammerThread';
import isYammerEnabled from 'owa-mail-store-actions/lib/utils/isYammerEnabled';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import type { YammerCardViewState } from 'owa-yammer-thread';

export default function initializeYammerCard(
    readingPaneViewState: ConversationReadingPaneViewState | ItemReadingPaneViewState,
    yammerItem: ClientItem,
    isAnyItemNonYammer: boolean = false
) {
    if (!isYammerEnabled()) {
        return;
    }

    // If any item is detected as a YammerThread set the derived properties
    if (yammerItem?.YammerData) {
        setExtendedCardViewState(readingPaneViewState, {
            cardViewState: {
                yammerScenario: yammerItem.YammerData,
            } as YammerCardViewState,
            cardType: ExtendedCardType.Yammer,
            inScrollRegion: false,
            coverOriginalContent: !isAnyItemNonYammer,
        });
    }
}

export function findItemWithYammer(loadedItemParts: ItemPartViewState[]): [ClientItem, boolean] {
    let isAnyItemNonYammer = false;
    let yammerItem = null;
    loadedItemParts.forEach((itemPart: ItemPartViewState) => {
        if (itemPart) {
            const loadedItem = mailStore.items.get(itemPart.itemId);

            if (loadedItem) {
                if (isMessageYammerThread(loadedItem)) {
                    yammerItem = loadedItem;
                } else {
                    isAnyItemNonYammer = true;
                }
            }
        }
    });

    return yammerItem?.YammerData ? [yammerItem, isAnyItemNonYammer] : [null, false];
}
