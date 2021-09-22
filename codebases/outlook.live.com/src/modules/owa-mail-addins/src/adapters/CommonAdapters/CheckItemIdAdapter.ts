import { getItem } from '../../utils/getItem';
import type { ClientItemId } from 'owa-client-ids';
import { getSelectedTableView } from 'owa-mail-list-store';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import { lazyLoadItem } from 'owa-mail-store-actions';

//It checks if the item id is valid or not
export async function checkItemId(itemId: string) {
    let item = getItem(itemId);
    if (!item || !item.NormalizedBody) {
        const clientItemId: ClientItemId = {
            Id: itemId,
            mailboxInfo: getMailboxInfo(getSelectedTableView()),
        };
        item = await lazyLoadItem.importAndExecute(clientItemId, 'LoadMore');
    }
    if (!item) {
        throw new Error('ErrorInvalidIdMalformed');
    }
}
