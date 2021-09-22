import { getItem } from '../../utils/getItem';
import type { ClientItemId } from 'owa-client-ids';
import { ComposeTarget } from 'owa-mail-compose-store';
import { lazyLoadDraftToCompose } from 'owa-mail-compose-actions';
import { getSelectedTableView } from 'owa-mail-list-store';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import { lazyLoadItem } from 'owa-mail-store-actions';
import popoutReadingPane from 'owa-popout-utils/lib/utils/popoutReadingPane';

export async function displayMessageForm(itemId: string) {
    let item = getItem(itemId);
    if (!item || !item.NormalizedBody) {
        const clientItemId: ClientItemId = {
            Id: itemId,
            mailboxInfo: getMailboxInfo(getSelectedTableView()),
        };
        item = await lazyLoadItem.importAndExecute(clientItemId, 'LoadItemReadingPaneMailAddins');
    }

    if (item.IsDraft) {
        await openComposeItem(itemId);
    } else {
        popoutReadingPane(itemId);
    }
}

export async function openComposeItem(itemId: string) {
    await lazyLoadDraftToCompose.importAndExecute(itemId, null /* sxsId */, ComposeTarget.Popout);
}
