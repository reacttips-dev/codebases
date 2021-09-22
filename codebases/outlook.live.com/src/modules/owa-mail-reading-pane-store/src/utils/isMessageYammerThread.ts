import setYammerData, { setYammerDataToNull } from '../actions/setYammerData';
import { logUsage } from 'owa-analytics';
import type { ClientItem } from 'owa-mail-store';
import type Message from 'owa-service/lib/contract/Message';
import doesFolderIdEqualName from 'owa-session-store/lib/utils/doesFolderIdEqualName';

const YAMMER_SENDER_DOMAINS = [
    '@yammerteamlabs.com',
    '@yammerqa.com',
    '@yammer.com',
    '@eu.yammer.com',
];

export default function isMessageYammerThread(item: ClientItem): boolean {
    if (!item) {
        return false;
    }

    // In case we have already parsed the yammer thread id, there's no need to do it again.
    if (item.YammerData == undefined) {
        const message = item as Message;
        if (message.YammerNotification || message.ExtensibleContentData) {
            if (doesFolderIdEqualName(message.ParentFolderId.Id, 'junkemail')) {
                logUsage('Yammer_onJunkFolder', {}, { logEvery: 1 });
                setYammerDataToNull(item);
                return false;
            }

            const senderSmtp = (message.From
                ? message.From.Mailbox?.EmailAddress
                : message.Sender?.Mailbox?.EmailAddress
            )?.toLowerCase();

            const isValidSender = senderSmtp
                ? YAMMER_SENDER_DOMAINS.some(domain => senderSmtp.indexOf(domain) > -1)
                : false;

            if (!isValidSender) {
                logUsage('Yammer_InvalidSender', {}, { logEvery: 1 });
                setYammerDataToNull(item);
                return false;
            }

            setYammerData(item);
        }
    }

    return !!item.YammerData;
}
