import { beforeUnloadConfirmationText } from './beforeUnloadHandler.locstring.json';
import loc from 'owa-localize';
import { isViewStateDirty } from './viewStateUtils';
import { getStore, AsyncSendState } from 'owa-mail-compose-store';

const BEFORE_UNLOAD_EVENT = 'beforeunload';
let beforeUnloadHandlerAdded = false;

function onBeforeUnload(ev: BeforeUnloadEvent) {
    // VSO 35426: Warn user if they are trying to close out of the browser
    // during delayed send, since the send has not yet actually happened
    getStore().viewStates.forEach(viewState => {
        if (isViewStateDirty(viewState) || viewState.asyncSendState === AsyncSendState.Delay) {
            ev.returnValue = loc(beforeUnloadConfirmationText);
        }
    });
}

export default function attachBeforeUnloadHandler() {
    if (!beforeUnloadHandlerAdded) {
        window.addEventListener(BEFORE_UNLOAD_EVENT, onBeforeUnload);
        beforeUnloadHandlerAdded = true;
    }
}
