import type { SaveToCloudStatus } from 'owa-attachment-savetocloud';
import type { ClientAttachmentId } from 'owa-client-ids';

let registeredCallback: (
    saveToCloudStatus: SaveToCloudStatus,
    attachmentId: ClientAttachmentId,
    sxsId: string
) => void = null;

export const setSaveToCloudStatusHelper = {
    register: (
        callback: (
            saveToCloudStatus: SaveToCloudStatus,
            attachmentId: ClientAttachmentId,
            sxsId: string
        ) => void
    ) => {
        registeredCallback = callback;
    },
    run: (
        saveToCloudStatus: SaveToCloudStatus,
        attachmentId: ClientAttachmentId,
        sxsId: string
    ) => {
        if (registeredCallback) {
            registeredCallback(saveToCloudStatus, attachmentId, sxsId);
        }
    },
};
