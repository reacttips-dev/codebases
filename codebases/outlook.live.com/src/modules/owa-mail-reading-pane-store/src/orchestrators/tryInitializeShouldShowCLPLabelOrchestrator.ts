import getAllItemsShownInConversation from '../utils/getAllItemsShownInConversation';
import type Message from 'owa-service/lib/contract/Message';
import updateShouldShowCLPLabel from '../actions/updateShouldShowCLPLabel';
import { default as tryInitializeShouldShowCLPLabel } from '../actions/tryInitializeShouldShowCLPLabel';
import { orchestrator } from 'satcheljs';

export default orchestrator(tryInitializeShouldShowCLPLabel, actionMessage => {
    let items = getAllItemsShownInConversation(
        actionMessage.conversationViewState,
        false /* getNewestItemFirst */
    );
    if (!items || items.length <= 0) {
        return;
    }

    //Always compare to the oldest itempart
    const labelToCompare = items[0].MSIPLabelGuid;

    if (actionMessage.conversationViewState) {
        items.forEach(item => {
            let shouldShowCLPLabel = item.MSIPLabelGuid !== labelToCompare;
            let itemPart = actionMessage.conversationViewState.itemPartsMap.get(
                (<Message>item).InternetMessageId
            );
            updateShouldShowCLPLabel(itemPart, shouldShowCLPLabel);
        });
    }
});
