import type { FromViewState } from 'owa-mail-compose-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setIsFromEditing',
    function setIsFromEditing(viewState: FromViewState, isFromEditing: boolean) {
        viewState.isFromEditing = isFromEditing;
    }
);
