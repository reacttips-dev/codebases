import trySaveAndCloseCompose from '../actions/trySaveAndCloseCompose';
import upConvert from '../actions/upConvert';
import loc from 'owa-localize';
import { beforeUnloadConfirmationText } from './beforeUnloadHandler.locstring.json';
import { getStore, AsyncSendState } from 'owa-mail-compose-store';
import {
    TabHandler,
    MailComposeTabViewState,
    TabType,
    registerTabHandler,
    TabState,
} from 'owa-tab-store';
import { lazyPrepareAddinCommunicationInPopout } from 'owa-addins-common-utils';
import { getComposeHostItemIndex } from 'owa-addins-core';
import trySaveMessage from '../actions/trySaveMessage';
import getDeeplinkUrl from 'owa-popout-v2/lib/utils/getDeeplinkUrl';
import { convertEwsIdToRestId } from 'owa-identifiers';

const composeTabHandler: TabHandler = {
    onActivate: (viewState: MailComposeTabViewState) => {
        const store = getStore();
        const composeViewState = store.viewStates.get(viewState.data);
        if (composeViewState.isInlineCompose) {
            upConvert(composeViewState);
        }
    },

    canClose: async (viewState: MailComposeTabViewState) => {
        const store = getStore();
        const composeViewState = store.viewStates.get(viewState.data);
        await trySaveAndCloseCompose(composeViewState);
        // Always return false since trySaveAndCloseCompose() will close compose if it can
        return false;
    },

    onPopout: (viewState: MailComposeTabViewState, targetWindow: Window) => {
        targetWindow.addEventListener('beforeunload', e => {
            const store = getStore();
            const composeViewState = store.viewStates.get(viewState.data);
            if (
                viewState.state == TabState.Popout && // For pop in scenario, state will be other value
                composeViewState?.isDirty &&
                composeViewState.asyncSendState != AsyncSendState.Sending &&
                composeViewState.asyncSendState != AsyncSendState.Delay
            ) {
                e.returnValue = loc(beforeUnloadConfirmationText);
            }
        });
        lazyPrepareAddinCommunicationInPopout.importAndExecute(
            targetWindow,
            getComposeHostItemIndex(viewState.data)
        );
    },

    onBlurProjection: (viewState: MailComposeTabViewState) => {
        const store = getStore();
        const composeViewState = store.viewStates.get(viewState.data);

        if (composeViewState.isDirty) {
            trySaveMessage(composeViewState, true /*isAutoSave*/);
        }
    },

    onBeforeCloseMainWindow: (viewState: MailComposeTabViewState) => {
        const store = getStore();
        const composeViewState = store.viewStates.get(viewState.data);
        const { isDirty, itemId } = composeViewState;

        return isDirty
            ? null
            : getDeeplinkUrl(
                  'mail',
                  'compose/' + (itemId ? encodeURIComponent(convertEwsIdToRestId(itemId.Id)) : ''),
                  { isStandalone: true }
              );
    },
};

export default function ensureComposeTabHandler() {
    registerTabHandler(TabType.MailCompose, composeTabHandler);
}
