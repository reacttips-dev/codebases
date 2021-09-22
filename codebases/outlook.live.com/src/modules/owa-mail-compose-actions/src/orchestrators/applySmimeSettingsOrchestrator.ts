import { applySmimeSettings, onSmimeOptionsChange } from '../actions/smimeActions';
import tryGetSmimeViewState from '../utils/tryGetSmimeViewState';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import loadSmimeComposeInfobars from '../actions/loadSmimeComposeInfobars';
import { orchestrator } from 'satcheljs';
import SmimeContext from 'owa-smime-types/lib/schema/SmimeContext';
import setSmimeErrorCode from 'owa-smime/lib/actions/setSmimeErrorCode';

/**
 * Updates SmimeViewState with admin/user settings in new compose.
 */
export default orchestrator(applySmimeSettings, async actionMessage => {
    const { composeViewState } = actionMessage;
    const smimeViewState: SmimeViewState = await tryGetSmimeViewState(composeViewState.operation);
    if (isSmimeEnabledInViewState(smimeViewState)) {
        onSmimeOptionsChange(
            composeViewState,
            smimeViewState.shouldEncryptMessageAsSmime,
            smimeViewState.shouldSignMessageAsSmime
        );
    }

    if (smimeViewState?.errorCode) {
        setSmimeErrorCode(
            composeViewState.smimeViewState,
            smimeViewState.errorCode,
            SmimeContext.Unspecified
        );
        loadSmimeComposeInfobars(composeViewState);
    }
});
