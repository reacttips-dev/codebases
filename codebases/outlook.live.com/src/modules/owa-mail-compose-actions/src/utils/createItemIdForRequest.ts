import itemId from 'owa-service/lib/factory/itemId';
import type ItemId from 'owa-service/lib/contract/ItemId';

export default function createItemIdForRequest(id: ItemId) {
    return id
        ? itemId({
              Id: id.Id,
              ChangeKey: id.ChangeKey,
          })
        : null;
}
