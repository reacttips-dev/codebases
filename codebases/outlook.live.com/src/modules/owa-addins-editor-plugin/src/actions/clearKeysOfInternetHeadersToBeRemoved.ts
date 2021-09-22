import type { AddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'clearKeysOfInternetHeadersToBeRemoved',
    (viewState: AddinViewState) => {
        viewState.keysOfInternetHeadersToBeRemoved = [];
    }
);
