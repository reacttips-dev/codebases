import { orchestrator } from 'satcheljs';
import { newMailNotificationAction } from 'owa-app-notifications-core';
import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import { getFolderByDistinguishedId } from 'owa-folders';
import setUnseenCount from '../mutators/setUnseenCount';
import getStore from '../store/store';
import { getUserConfiguration } from 'owa-session-store';

orchestrator(newMailNotificationAction, actionMessage => {
    if (getSelectedFolder() !== getFolderByDistinguishedId('inbox') || document.hidden) {
        const { notification } = actionMessage;

        // If Focused inbox is enabled, we should only add "Focused" mails to the unseen count
        if (
            notification.InferenceClassification === 'Focused' ||
            !getUserConfiguration().UserOptions.IsFocusedInboxEnabled
        ) {
            setUnseenCount(getStore().unseenMessages + 1);
        }
    }
});
