/**
 * returns whether the string ItemClass corresponds to a Message
 */
export const isItemClassOfMessageType = (itemClass: string) =>
    itemClass &&
    ['IPM.Note', 'IPM.Schedule.Meeting', 'IPM.GroupMailbox.JoinRequest', 'IPM.Post'].includes(
        itemClass
    );
