import type { ComposeViewState } from 'owa-mail-compose-store';
import trySaveMessage from 'owa-mail-compose-actions/lib/actions/trySaveMessage';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';

const saveItem = (viewState: ComposeViewState) => (): Promise<string> => {
    updateContentToViewState(viewState);

    return trySaveMessage(viewState, /* autoSave */ false, /* rejectWhenFail */ true)
        .then(() => Promise.resolve(viewState.itemId.Id))
        .catch(() => Promise.resolve(null));
};

export default saveItem;
