import type Message from 'owa-service/lib/contract/Message';

export default function getAmpSender(message: Message): string {
    return message.From?.Mailbox ? message.From.Mailbox.EmailAddress : null;
}
