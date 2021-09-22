import mailStore from 'owa-mail-store/lib/store/Store';
import type { ClientItem } from 'owa-mail-store';

export function getItem(itemId: string): ClientItem {
    return mailStore.items.get(itemId);
}
