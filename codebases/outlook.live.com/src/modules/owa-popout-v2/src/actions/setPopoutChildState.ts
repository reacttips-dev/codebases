import { getStore } from '../store/childStore';
import { mutatorAction } from 'satcheljs';
import { PopoutChildState } from '../store/schema/PopoutChildStore';
import { postMessage, PopoutMessageType } from '../utils/crossWindowMessenger';

export default mutatorAction('setPopoutChildState', (state: PopoutChildState) => {
    const store = getStore();
    store.state = state;

    if (state == PopoutChildState.Ready && store.isPopoutV2 && window.opener) {
        postMessage(window.opener, PopoutMessageType.DeeplinkReady, null);
    }
});
