import { closeMessage, addinCloseCompose } from './CloseAdapter.locstring.json';
import { closeButton } from 'owa-locstrings/lib/strings/closebutton.locstring.json';
import loc from 'owa-localize';
import { confirm, DialogResponse } from 'owa-confirm-dialog';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { lazyCloseCompose } from 'owa-mail-compose-actions';
import { isViewStateDirty } from 'owa-mail-compose-actions/lib/utils/viewStateUtils';

export const closeItem = (viewState: ComposeViewState) => (): void => {
    confirm(
        loc(closeMessage),
        loc(addinCloseCompose),
        !isViewStateDirty(viewState) /* Resolve Immediately */,
        {
            okText: loc(closeButton),
            hideCancelButton: false,
        }
    ).then((result: DialogResponse) => {
        if (result == DialogResponse.ok) {
            lazyCloseCompose.importAndExecute(viewState);
        }
    });
};
