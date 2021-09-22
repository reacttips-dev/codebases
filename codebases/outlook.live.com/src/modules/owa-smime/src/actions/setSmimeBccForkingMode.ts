import { action } from 'satcheljs';
import type SmimeBccForkingMode from 'owa-smime-types/lib/schema/SmimeBccForkingMode';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';

// Action called to set the SmimeBccForkingMode to include appropriate recipients
export default action(
    'setSmimeBccForkingMode',
    (smimeViewState: SmimeViewState, smimeBccForkingMode: SmimeBccForkingMode) => ({
        smimeViewState,
        smimeBccForkingMode,
    })
);
