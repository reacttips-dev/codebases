import type Message from 'owa-service/lib/contract/Message';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function getIsSentOnBehalfOf(message: Message) {
    return isConsumer()
        ? false
        : !message.IsDraft &&
              message.From &&
              message.Sender &&
              message.From.Mailbox &&
              message.Sender.Mailbox &&
              message.From.Mailbox.EmailAddress &&
              message.Sender.Mailbox.EmailAddress &&
              message.From.Mailbox.EmailAddress.toLowerCase() !=
                  message.Sender.Mailbox.EmailAddress.toLowerCase();
}
