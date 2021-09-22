import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { orchestrator } from 'satcheljs';
import { setEmailSignature } from 'owa-getstarted/lib/actions/setupEmailSignature';

orchestrator(setEmailSignature, () => {
    lazyMountAndShowFullOptions.importAndExecute('mail', 'messageContent');
});
