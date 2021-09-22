import type { AddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'removeInternetHeaders',
    (viewState: AddinViewState, headerNames: string[]) => {
        headerNames.forEach(name => {
            if (viewState.internetHeaders.get(name)) {
                viewState.keysOfInternetHeadersToBeRemoved.push(name);
                viewState.internetHeaders.delete(name);
            }
        });
    }
);
