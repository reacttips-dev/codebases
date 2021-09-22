import { mutatorAction } from 'satcheljs';
import type InlineImageViewState from '../schema/InlineImageViewState';

const clearObjectUrls = mutatorAction(
    'ClearInlineImageObjectUrls',
    (viewState: InlineImageViewState) => {
        Object.keys(viewState.objectUrls).forEach(objectUrl => URL.revokeObjectURL(objectUrl));
        viewState.objectUrls = {};
    }
);

export default clearObjectUrls;
