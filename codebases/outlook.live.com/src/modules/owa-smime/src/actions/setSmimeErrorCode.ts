import { action } from 'satcheljs';
import type SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';
import type SmimeContext from 'owa-smime-types/lib/schema/SmimeContext';

/**
 * Action fired when S/MIME encoding process encounters an error.
 */
export default action(
    'setSmimeErrorCode',
    (
        smimeViewState: SmimeViewState,
        errorCode: SmimeErrorStateEnum,
        errorContext: SmimeContext
    ) => ({
        smimeViewState,
        errorCode,
        errorContext,
    })
);
