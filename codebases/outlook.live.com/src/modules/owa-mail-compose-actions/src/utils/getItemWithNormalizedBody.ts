import { ClientItemId, getUserMailboxInfo } from 'owa-client-ids';
import type { ClientItem } from 'owa-mail-store';
import { lazyLoadItem } from 'owa-mail-store-actions';

const getItemWithNormalizedBody = (itemId: string): Promise<ClientItem> => {
    const clientItemId: ClientItemId = {
        Id: itemId,
        mailboxInfo: getUserMailboxInfo(),
    };
    return lazyLoadItem.importAndExecute(clientItemId, 'LoadForSmimeResponse');
};

export default getItemWithNormalizedBody;
