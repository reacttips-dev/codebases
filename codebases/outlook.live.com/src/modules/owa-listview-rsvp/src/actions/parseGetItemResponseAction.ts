import type { ClientItemId } from 'owa-client-ids';
import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs';

export const parseGetItemResponseAction = action(
    'parseGetItemResponseAction',
    (items: Item[], clientItemIds: ClientItemId[]) => ({
        items: items,
        clientItemIds: clientItemIds,
    })
);
