import mailStore from '../store/Store';
import type Item from 'owa-service/lib/contract/Item';

export default function selectMailStoreItemById(itemId: string): Item {
    return mailStore.items.get(itemId);
}
