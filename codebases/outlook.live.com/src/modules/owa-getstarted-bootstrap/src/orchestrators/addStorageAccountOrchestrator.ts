import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { orchestrator } from 'satcheljs';
import { addStorageAccount } from 'owa-getstarted/lib/actions/addStorageAccount';

orchestrator(addStorageAccount, () => {
    lazyMountAndShowFullOptions.importAndExecute('mail', 'attachments');
});
