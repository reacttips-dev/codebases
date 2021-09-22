import {
    sendFeedbackDialogTitle,
    sendFeedbackEmailSubject,
    sendFeedbackEmailContentStart,
} from './createSendFeedbackCallback.locstring.json';
import loc from 'owa-localize';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import * as DisplayNewMessageForm from '../adapters/ReadAdapters/DisplayNewMessageFormAdapter';

export default function sendFeedbackCallback() {
    const recipients: EmailAddressWrapper[] = [
        {
            Name: loc(sendFeedbackDialogTitle),
            EmailAddress: 'outlookinclientstorefeedback@service.microsoft.com',
        },
    ];
    DisplayNewMessageForm.displayNewMessageForm(
        recipients,
        [],
        [],
        loc(sendFeedbackEmailSubject),
        loc(sendFeedbackEmailContentStart),
        []
    );
}
