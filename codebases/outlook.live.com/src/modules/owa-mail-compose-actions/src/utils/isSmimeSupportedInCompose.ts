import { ComposeOperation } from 'owa-mail-compose-store';
import type Item from 'owa-service/lib/contract/Item';
import { isItemClassSmime } from 'owa-smime/lib/utils/smimeItemClassUtils';

/**
 * Both S/MIME reply and forward are allowed on the below item class
 */
const SMIME_SUPPORTED_ITEM_CLASSES = ['REPORT.IPM.Note', 'IPM.Note.Rules', 'IPM.Post'];

/**
 * @param operation current composeOperation.
 * @param itemClass parentItemClass in case of reply/replyAll/forward and draftItemClass in case of draft.
 */
export const isSmimeSupportedForItemClass = (
    operation: ComposeOperation,
    itemClass?: string
): boolean => {
    if (!itemClass || itemClass === 'IPM.Note' || isItemClassSmime(itemClass)) {
        // Allow S/MIME for items with default class or S/MIME class
        return true;
    }

    const isReply = operation === ComposeOperation.Reply || operation === ComposeOperation.ReplyAll;
    const isReplyOrForward = isReply || operation === ComposeOperation.Forward;
    const isMeetingOrAppointment =
        itemClass.indexOf('IPM.Schedule.Meeting') === 0 ||
        itemClass.indexOf('IPM.Appointment') === 0;

    if (isReply && isMeetingOrAppointment) {
        /**
         * Allow reply for meeting requests/responses and appointments.
         * Forwarding a meeting is not supported because a forward will create a new meeting
         * and S/MIME is only supported for email.
         */
        return true;
    }

    if (isReplyOrForward) {
        return SMIME_SUPPORTED_ITEM_CLASSES.some(
            supportedItemClass => itemClass.indexOf(supportedItemClass) === 0
        );
    }

    return false;
};

/**
 * This util returns whether S/MIME is supported in
 * current context. S/MIME is supported for
 * NewCompose/Reply/ReplyAll/Forward.
 * @param operation current composeOperation.
 * @param item parentItem in case of reply/replyAll/forward and draftItem in case of draft.
 */
const isSmimeSupportedInCompose = (operation: ComposeOperation, item?: Item) => {
    switch (operation) {
        case ComposeOperation.New:
            return true;
        case ComposeOperation.Reply:
        case ComposeOperation.ReplyAll:
        case ComposeOperation.Forward:
        case ComposeOperation.EditDraft:
            return item && isSmimeSupportedForItemClass(operation, item.ItemClass);
        default:
            // All other operations are not supported, like accept, decline, cancel, etc.
            return false;
    }
};
export default isSmimeSupportedInCompose;
