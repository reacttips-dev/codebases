import { action } from 'satcheljs';
import { task_Send_Email_Subject, task_Send_Email_Body } from '../getStarted.locstring.json';
import loc, { format } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export let sendAnEmail = action('SEND_AN_EMAIL', () => ({
    taskSendEmailSubject: format(
        loc(task_Send_Email_Subject),
        getUserConfiguration().SessionSettings.UserEmailAddress
    ),
    taskSendEmailBody: format(
        loc(task_Send_Email_Body),
        getUserConfiguration().SessionSettings.UserEmailAddress
    ),
}));
