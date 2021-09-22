import getSmimeAttachmentType from './getSmimeAttachmentType';
import isSMIMEItem from './isSMIMEItem';
import type Item from 'owa-service/lib/contract/Item';

// In conversation view, if an item is S/MIME item, and we do not have its p7m attachment,
// it means that the message is already decoded and available to read. In such cases,
// we do not want to force the user to open the message in popout to be able to reply/ forward.
// Therefore disable only if we have a p7m attachment.
export default function isSmimeResponseDisabled(
    item: Item,
    isConversationItemPart: boolean
): boolean {
    return isSMIMEItem(item) && isConversationItemPart && !!getSmimeAttachmentType(item);
}
