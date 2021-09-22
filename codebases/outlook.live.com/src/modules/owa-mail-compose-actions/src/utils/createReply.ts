import getBodyTypeForResponse from './getBodyTypeForResponse';
import getRespondSubject from './getRespondSubject';
import getToCcRecipients from './getToCcRecipients';
import { ComposeOperation } from 'owa-mail-compose-store';
import buildReplyForwardMessageBody from '../utils/buildReplyForwardMessageBody';
import createItemIdForRequest from '../utils/createItemIdForRequest';
import getDocumentId from '../utils/getDocumentId';
import type { ObservableMap } from 'mobx';
import { lazyLoadAllRecipientsForItem } from 'owa-mail-store-actions';
import store from 'owa-mail-store/lib/store/Store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import type ReplyAllToItem from 'owa-service/lib/contract/ReplyAllToItem';
import type ReplyToItem from 'owa-service/lib/contract/ReplyToItem';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import replyAllToItem from 'owa-service/lib/factory/replyAllToItem';
import replyToItem from 'owa-service/lib/factory/replyToItem';
import shouldRemoteExecuteForSelectedNode from '../utils/shouldRemoteExecuteForSelectedNode';
import createSmartResponseItem from '../services/createSmartResponseItem';
import hasMoreRecipientsOnServer from 'owa-recipient-common/lib/utils/hasMoreRecipientsOnServer';

export interface CreateReplyState {
    items: ObservableMap<string, Item>;
}

// create a draft reply in a single call
export default async function createReply(
    referenceItemId: string,
    isReplyAll: boolean,
    groupId: string,
    suppressServerMarkReadOnReplyOrForward: boolean,
    state: CreateReplyState = { items: store.items }
): Promise<Message> {
    if (!state.items.has(referenceItemId)) {
        return null;
    }
    const referenceItem = state.items.get(referenceItemId) as Message;
    const replyItem = await createReplyItem(referenceItem, isReplyAll);
    const message = await createSmartResponseItem(
        replyItem,
        groupId,
        suppressServerMarkReadOnReplyOrForward,
        shouldRemoteExecuteForSelectedNode()
    );
    return message;
}

// alternatively create an instance of a reply item to be used later to
// create the reply - this allows the caller to do something after the
// reply item has been created (e.g. so the caller can use the properties
// of the reply item such as the recipients) but before the call to
// createItem has been made
export async function createReplyItem(
    referenceItem: Message,
    isReplyAll: boolean
): Promise<ReplyToItem | ReplyAllToItem> {
    const [toRecipients, ccRecipients] = await getToCcRecipientsForReply(referenceItem, isReplyAll);
    // The BCC recipients should be carried over on a reply all to your own item (VSO 39177)
    // This property will exist on items in your Sent folder
    const bccRecipients =
        isReplyAll && referenceItem.BccRecipients ? [...referenceItem.BccRecipients] : [];
    const bodyType = getBodyTypeForResponse(referenceItem);
    const body = bodyContentType({
        BodyType: bodyType,
        Value: buildReplyForwardMessageBody('', bodyType),
    });
    const itemId = createItemIdForRequest(referenceItem.ItemId);
    const documentId = getDocumentId(referenceItem);
    const composeOperation = isReplyAll ? ComposeOperation.ReplyAll : ComposeOperation.Reply;
    const subject = getRespondSubject(referenceItem, composeOperation);
    const item = isReplyAll
        ? replyAllToItem({
              ReferenceItemId: itemId,
              ReferenceItemDocumentId: documentId,
              ToRecipients: toRecipients,
              CcRecipients: ccRecipients,
              BccRecipients: bccRecipients,
              NewBodyContent: body,
              Subject: subject,
          })
        : replyToItem({
              ReferenceItemId: itemId,
              ReferenceItemDocumentId: documentId,
              ToRecipients: toRecipients,
              NewBodyContent: body,
              Subject: subject,
          });
    return item;
}

export async function getToCcRecipientsForReply(
    referenceItem: Message,
    isReplyAll: boolean
): Promise<[EmailAddressWrapper[], EmailAddressWrapper[]]> {
    const { ToRecipients, CcRecipients, BccRecipients, RecipientCounts } = referenceItem;
    if (
        isReplyAll &&
        hasMoreRecipientsOnServer(RecipientCounts, ToRecipients, CcRecipients, BccRecipients)
    ) {
        await lazyLoadAllRecipientsForItem.importAndExecute(referenceItem);
    }

    return getToCcRecipients(
        referenceItem.From
            ? referenceItem.From.Mailbox
            : referenceItem.Sender
            ? referenceItem.Sender.Mailbox
            : null,
        referenceItem.ToRecipients,
        referenceItem.CcRecipients,
        referenceItem.ReplyTo,
        isReplyAll
    );
}
