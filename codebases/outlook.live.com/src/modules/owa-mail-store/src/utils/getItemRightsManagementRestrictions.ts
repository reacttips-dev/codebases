import RightsManagementFailureCode from '../store/schema/RightsManagementFailureCode';
import type IRMRestrictions from '../store/schema/IRMRestrictions';
import type Item from 'owa-service/lib/contract/Item';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';

export default function getItemRightsManagementRestrictions(item: Item): IRMRestrictions {
    const IRMData = item ? item.RightsManagementLicenseData : null;
    let restrictions = {
        ReplyAllowed: true,
        ReplyAllAllowed: true,
        ForwardAllowed: true,
        PrintAllowed: true,
        CopyAllowed: true,
    } as IRMRestrictions;

    if (
        IRMData &&
        (!IRMData.RightsManagedMessageDecryptionStatus ||
            IRMData.RightsManagedMessageDecryptionStatus == RightsManagementFailureCode.Success)
    ) {
        const {
            ReplyAllowed,
            ReplyAllAllowed,
            ForwardAllowed,
            PrintAllowed,
            ExtractAllowed,
        } = IRMData;
        restrictions = {
            ReplyAllowed: ReplyAllowed,
            ReplyAllAllowed: ReplyAllAllowed,
            ForwardAllowed: ForwardAllowed,
            PrintAllowed: PrintAllowed,
            CopyAllowed: ExtractAllowed,
        };
    }

    // Also consider the 'Do Not Forward' flag if this is a meeting request message
    const meetingRequestMessage = item as MeetingRequestMessageType;
    const doNotForwardMeeting = meetingRequestMessage?.DoNotForwardMeeting;
    restrictions.ForwardAllowed = restrictions.ForwardAllowed && !doNotForwardMeeting;

    return restrictions;
}
