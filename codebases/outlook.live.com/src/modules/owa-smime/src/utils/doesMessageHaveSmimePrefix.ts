import { PREFIX } from 'owa-smime-adapter/lib/utils/constants';
import type Message from 'owa-service/lib/contract/Message';

/**
 * Utility to determine whether message has "smime" as its prefix
 * When a message is constructed through item attachment mime, the format of item id returned by control is "smime- guid"
 * @param message
 */
export default function doesMessageHaveSmimePrefix(message: Message): boolean {
    return message?.ItemId && message.ItemId.Id.indexOf(PREFIX) === 0;
}
