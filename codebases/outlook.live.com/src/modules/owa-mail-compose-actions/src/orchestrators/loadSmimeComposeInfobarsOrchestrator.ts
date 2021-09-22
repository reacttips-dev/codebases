import { orchestrator } from 'satcheljs';
import loadSmimeComposeInfobars from '../actions/loadSmimeComposeInfobars';
import SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';

export default orchestrator(loadSmimeComposeInfobars, actionMessage => {
    const { viewState } = actionMessage;
    if (
        viewState.smimeViewState &&
        viewState.smimeViewState.errorCode != SmimeErrorStateEnum.NoError
    ) {
        const { errorCode } = viewState.smimeViewState;
        addInfoBarMessage(
            viewState,
            errorCode == SmimeErrorStateEnum.ControlError
                ? 'smimeAdapterInitializationError'
                : 'smimeEncodeError'
        );
    }
});
