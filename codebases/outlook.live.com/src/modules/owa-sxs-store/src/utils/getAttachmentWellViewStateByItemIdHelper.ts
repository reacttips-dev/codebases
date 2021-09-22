import type { AttachmentWellViewState } from 'owa-attachment-well-data';
import * as trace from 'owa-trace';

let registeredCallback: (conversationId: string, itemId: string) => AttachmentWellViewState = null;

const getAttachmentWellViewStateByItemIdHelper = {
    register: (callback: (conversationId: string, itemId: string) => AttachmentWellViewState) => {
        registeredCallback = callback;
    },
    available: () => !!registeredCallback,
    run: (conversationId: string, itemId: string) => {
        if (registeredCallback) {
            return registeredCallback(conversationId, itemId);
        } else {
            trace.errorThatWillCauseAlert(
                'getAttachmentWellViewStateByItemIdHelper is not registered.'
            );
            return null;
        }
    },
};

export { getAttachmentWellViewStateByItemIdHelper };
