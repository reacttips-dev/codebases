import { action } from 'satcheljs';

const transferProjectionTab = action(
    'Popout_TransferProjectionTab',
    (oldTabId: string, newTabId: string) => ({
        oldTabId,
        newTabId,
    })
);

export default transferProjectionTab;
