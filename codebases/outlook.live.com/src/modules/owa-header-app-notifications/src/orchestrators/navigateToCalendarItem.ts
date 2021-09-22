import onReminderClicked from '../actions/onReminderClicked';
import { getUserMailboxInfo } from 'owa-client-ids';
import { lazyPopoutCalendarReadingPane } from 'owa-popout-calendar';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import { orchestrator } from 'satcheljs';

export default orchestrator(onReminderClicked, message => {
    // An orchestrator in calendar will be listening for the same action, and handle as appropriate
    if (
        message.reminderType == ReminderGroupTypes.Calendar &&
        getOwaWorkload() !== OwaWorkload.Calendar
    ) {
        lazyPopoutCalendarReadingPane.importAndExecute(
            { Id: message.itemId, mailboxInfo: getUserMailboxInfo() },
            'Reminder',
            null /* data */
        );
    }
});
