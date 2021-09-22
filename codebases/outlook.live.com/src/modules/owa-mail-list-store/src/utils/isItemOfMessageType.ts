import type Item from 'owa-service/lib/contract/Item';

export default function isItemOfMessageType(item: Item): boolean {
    // VSO 31290: Make isItemOfMessageType generic by looking at __type and comparing it with "Message:#Exchange"
    return (
        !item?.ItemClass || // server treats undefined or null ItemClass as a Message type by default
        item.ItemClass.indexOf('IPM.Note') !== -1 || // Normal messages
        item.ItemClass.indexOf('IPM.Schedule.Meeting') !== -1 || // Meeting request messages
        item.ItemClass.indexOf('IPM.GroupMailbox.JoinRequest') !== -1 || // Group join request messages
        item.ItemClass.indexOf('IPM.GroupMailbox.AddMemberRequest') !== -1 || // Group add member request messages
        item.ItemClass.indexOf('IPM.Post') !== -1 || //Post Message type
        item.ItemClass.indexOf('IPM.Sharing') !== -1 || // Calendar Sharing Message Type
        item.ItemClass.indexOf('IPM.Outlook.Recall') !== -1 // Recall message
    );
}
