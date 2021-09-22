import { createLazyOrchestrator } from 'owa-bundling';
import { updateItemMandatoryProperties } from 'owa-mail-actions/lib/conversationLoadActions';
import expandItemPartOnIsReadChanged from '../actions/expandItemPartOnIsReadChanged';

export const updateItemMandatoryPropertiesOrchestrator = createLazyOrchestrator(
    updateItemMandatoryProperties,
    'updateItemMandatoryPropertiesClone',
    actionMessage => {
        const {
            conversationId,
            nodeIdCollectionWithItemMandatoryPropertiesChanged,
        } = actionMessage;

        if (nodeIdCollectionWithItemMandatoryPropertiesChanged.isReadChangedToUnread.length > 0) {
            expandItemPartOnIsReadChanged(
                conversationId,
                nodeIdCollectionWithItemMandatoryPropertiesChanged.isReadChangedToUnread
            );
        }
    }
);
