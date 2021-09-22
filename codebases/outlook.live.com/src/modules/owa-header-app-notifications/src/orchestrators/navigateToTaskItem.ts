import onReminderClicked from '../actions/onReminderClicked';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { canShowToDoModule } from 'owa-todo-utils/lib/utils/moduleAccessUtils';
import getTaskItemReadDeepLinkUrl from 'owa-url/lib/getTaskItemReadDeepLinkUrl';
import getToDoTaskItemReadDeeplinkUrl from 'owa-url/lib/getToDoTaskItemReadDeeplinkUrl';
import { orchestrator } from 'satcheljs';

export default orchestrator(onReminderClicked, message => {
    if (message.reminderType == ReminderGroupTypes.Task) {
        window.open(
            canShowToDoModule()
                ? getToDoTaskItemReadDeeplinkUrl(message.itemId)
                : getTaskItemReadDeepLinkUrl(message.itemId)
        );
    }
});
