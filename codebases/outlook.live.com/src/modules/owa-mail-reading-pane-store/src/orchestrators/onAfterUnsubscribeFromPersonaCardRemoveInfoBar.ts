import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import getItemReadingPaneViewState from '../utils/getItemReadingPaneViewState';
import { onAfterUnsubscribe, UnsubscribeResponseType } from 'owa-brands-subscription';
import { confirm } from 'owa-confirm-dialog';
import removeInfoBarMessageInReadingPane from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import loc from 'owa-localize';
import { unsubscribeDialogActionFailed } from 'owa-locstrings/lib/strings/unsubscribedialogactionfailed.locstring.json';
import { unsubscribeDialogActionFailedText } from 'owa-locstrings/lib/strings/unsubscribedialogactionfailedtext.locstring.json';
import { orchestrator } from 'satcheljs';

export default orchestrator(onAfterUnsubscribe, actionMessage => {
    if (actionMessage.unsubscribeSourceType !== 'BrandCard') {
        return;
    }

    if (actionMessage.responseType === UnsubscribeResponseType.Success) {
        const conversationReadingPaneViewState = getConversationReadingPaneViewState();
        if (conversationReadingPaneViewState) {
            const { itemPartsMap } = conversationReadingPaneViewState;
            itemPartsMap.forEach(itemPart => {
                removeInfoBarMessageInReadingPane(itemPart, 'unsubscribeInfoBar');
            });
            return;
        }
        const itemReadingPaneViewState = getItemReadingPaneViewState();
        if (itemReadingPaneViewState.itemId) {
            removeInfoBarMessageInReadingPane(
                itemReadingPaneViewState.itemViewState,
                'unsubscribeInfoBar'
            );
            return;
        }
    } else {
        confirm(loc(unsubscribeDialogActionFailed), loc(unsubscribeDialogActionFailedText), false, {
            hideCancelButton: true,
        });
    }
});
