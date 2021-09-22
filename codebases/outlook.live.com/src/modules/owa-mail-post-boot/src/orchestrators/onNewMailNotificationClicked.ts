import { onNewMailNotificationClicked } from 'owa-header-app-notifications';
import { orchestrator } from 'satcheljs';
import selectFolderAndRow from 'owa-mail-routing/lib/selectFolderAndRow';
import { getUserConfiguration } from 'owa-session-store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';

export default orchestrator(onNewMailNotificationClicked, message => {
    const notification: NewMailNotificationPayload = message.notification;
    const rowId =
        getUserConfiguration().UserOptions.GlobalListViewTypeReact === ReactListViewType.Message
            ? notification.ItemId
            : notification.ConversationId;

    selectFolderAndRow('inbox', rowId);
});
