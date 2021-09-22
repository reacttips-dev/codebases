import { isReportItem } from './checkItemType';
import getItemRightsManagementRestrictions from 'owa-mail-store/lib/utils/getItemRightsManagementRestrictions';
import type Item from 'owa-service/lib/contract/Item';
import isSmimeResponseDisabled from 'owa-smime/lib/utils/isSmimeResponseDisabled';

export default function checkItemReplyForwardDisabled(
    item: Item,
    isConversationItemPart: boolean
): boolean[] {
    const irmRestrictions = getItemRightsManagementRestrictions(item);
    const smimeResponseDisabled = isSmimeResponseDisabled(item, isConversationItemPart);
    const isReport = isReportItem(item);

    const isReplyDisabled = !irmRestrictions.ReplyAllowed || isReport || smimeResponseDisabled;
    const isReplyAllDisabled =
        !irmRestrictions.ReplyAllAllowed || isReport || smimeResponseDisabled;
    const isForwardDisabled = !irmRestrictions.ForwardAllowed || smimeResponseDisabled;

    return [isReplyDisabled, isReplyAllDisabled, isForwardDisabled];
}
