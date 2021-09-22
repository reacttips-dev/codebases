import type { ComposeViewState, UIEnabledState } from 'owa-mail-compose-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setUIEnabledState',
    function setUIEnabledState(viewState: ComposeViewState, uiEnabledState: UIEnabledState) {
        viewState.uiEnabledState = uiEnabledState;
    }
);
