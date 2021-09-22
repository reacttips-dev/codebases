import { mutatorAction } from 'satcheljs';
import type { AddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';

export default mutatorAction('removeAppendOnSend', (viewState: AddinViewState) => {
    viewState.appendOnSend = [];
});
