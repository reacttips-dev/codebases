import type Item from 'owa-service/lib/contract/Item';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import { getUserMailboxInfo } from 'owa-client-ids';
import { convertIdsToTargetFormat, ConvertIdSource } from 'owa-immutable-id';
import { ConvertableIdFormat } from 'owa-immutable-id-store';

/**
 *
 * @param baseItem returns a getter for an item that wraps
 * the ImmutableIDs of an item with itemIds.
 */
export function wrapItemWithEwsIdGetter<T extends Item>(baseItem: T): () => Promise<T> {
    let cachedItemCopy: null | T = null;
    return async (): Promise<T> => {
        // If there is an itemId on the item, ensure that it matches
        // the itemId returned by getItemId.
        //
        // This is to ensure we consistently map the immutableId to the itemId.
        if (cachedItemCopy == null) {
            const [itemIdEws, seriesIdEws, conversationIdEws, ...attachmentIdsEws]: (
                | string
                | null
            )[] = await convertIdsToTargetFormat(
                [
                    baseItem.ItemId?.Id,
                    (baseItem as CalendarItem).SeriesId,
                    baseItem.ConversationId?.Id,
                ]
                    .concat(
                        baseItem.Attachments?.map(attachment => attachment.AttachmentId?.Id) || []
                    )
                    .concat(
                        baseItem.Attachments?.map(
                            attachment => attachment.AttachmentId?.RootItemId
                        ) || []
                    ),
                ConvertableIdFormat.EwsId,
                getUserMailboxInfo().userIdentity,
                ConvertIdSource.Addins
            );

            cachedItemCopy = {
                // unfortunately we can't deepcopy the item here with JSON.parse/stringify
                // since _sometimes_ these objects are not safely serializable / deserializable.
                // (e.g. with calendar item's OwaDate date fields)
                //
                // Instead, below when we would update each of the item's fields, we
                // perform successive shallow copies of the subobjects, each of which we
                // know should be a simple object.
                //
                // This is all so we won't update the fields in the store, which
                // could pollute the main app and cause mobx invariant problems
                // since it's beyond an async gap
                ...baseItem,
            };

            if (itemIdEws) {
                cachedItemCopy.ItemId = {
                    Id: itemIdEws,
                };
            }

            if (seriesIdEws) {
                (cachedItemCopy as CalendarItem).SeriesId = seriesIdEws;
            }

            if (conversationIdEws) {
                cachedItemCopy.ConversationId = { ...baseItem.ConversationId! };
                cachedItemCopy.ConversationId!.Id = conversationIdEws;
            }

            // Set each attachment Id and RootItemId in order
            if (attachmentIdsEws.length) {
                // break references to the objects in the mobx store
                cachedItemCopy.Attachments = baseItem.Attachments!.map(attachment => {
                    const attachmentCopy = { ...attachment };
                    if (attachmentCopy.AttachmentId) {
                        attachmentCopy.AttachmentId = { ...attachmentCopy.AttachmentId };
                    }
                    return attachmentCopy;
                });

                for (let i = 0; i < attachmentIdsEws.length / 2; i++) {
                    let id = attachmentIdsEws[i];
                    if (id) {
                        cachedItemCopy.Attachments![i].AttachmentId!.Id = id;
                    }
                }
                for (let i = attachmentIdsEws.length / 2; i < attachmentIdsEws.length; i++) {
                    let rootItemId = attachmentIdsEws[i];
                    if (rootItemId) {
                        cachedItemCopy.Attachments![i].AttachmentId!.RootItemId = rootItemId;
                    }
                }
            }
        }
        return cachedItemCopy;
    };
}
