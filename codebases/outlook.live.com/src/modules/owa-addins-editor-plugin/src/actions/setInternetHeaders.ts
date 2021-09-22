import type { AddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { mutatorAction } from 'satcheljs';
import type { InternetHeaders } from 'owa-addins-core';

export default mutatorAction(
    'setInternetHeaders',
    (viewState: AddinViewState, newDictionary: InternetHeaders) => {
        viewState.internetHeaders = viewState.internetHeaders.merge(newDictionary);
    }
);
