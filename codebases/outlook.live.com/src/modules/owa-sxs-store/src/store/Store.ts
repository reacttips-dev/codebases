import { AttachmentPreviewMethod, AttachmentSelectionSource } from 'owa-attachment-data';
import { SaveToCloudStatus } from 'owa-attachment-savetocloud';
import EventEmitter from 'owa-event-emitter';
import { MeetingMessageAddToCalendarStatus } from 'owa-meeting-message';
import GetAttachmentTextPreviewReadMode from 'owa-service/lib/contract/GetAttachmentTextPreviewReadMode';
import getInitialSxSViewState from 'owa-sxsdata/lib/utils/getInitialSxSViewState';
import { createStore } from 'satcheljs';
import { EditMode } from './schema/SxSEditState';
import { SxSStoreData, SxSStore, SXSID_MAIN_WINDOW } from './schema/SxSStore';
import { ObservableMap } from 'mobx';

function createInitialStoreData(): SxSStoreData {
    const initialStoreData: SxSStoreData = {
        shouldShow: false,
        viewState: getInitialSxSViewState(),
        extendedViewState: {
            previewMode: AttachmentPreviewMethod.Unsupported,
            attachmentId: null,
            selectionSource: AttachmentSelectionSource.MailList,
            isCloudy: false,
            saveToCloudStatus: SaveToCloudStatus.disabled,
            textPreviewReadMode: GetAttachmentTextPreviewReadMode.AutoDetect,
        },
        editState: {
            mode: EditMode.View,
            editAllowed: false,
            itemId: null,
            isDraft: false,
        },
        customPreviewState: null,
        eventManager: new EventEmitter(),
        pendingPreviewOperation: null,
        pendingNavigation: null,
        readingPaneState: null,
        composeId: null,
        customization: null,
        isInvisible: true,
        shouldUseFakeRightHandSide: false,
        isUsingFakeRightHandSide: false,
        attachmentViewStateIdFromListView: null,
        sessionPreviewCount: 0,
        sessionStartTime: 0,
        meetingMessageAddToCalendarStatus: MeetingMessageAddToCalendarStatus.Available,
        sigsInfo: null,
    };
    initialStoreData.viewState.previewPane = null;
    return initialStoreData;
}

const defaultStore: SxSStore = {
    sxsStoreMapping: new ObservableMap<string, SxSStoreData>({}),
};
export const getStore = createStore<SxSStore>('sxsStore', defaultStore);

export default function getOrCreateSxSStoreData(sxsId?: string): SxSStoreData {
    sxsId = sxsId || SXSID_MAIN_WINDOW;
    if (!getStore().sxsStoreMapping.has(sxsId)) {
        const initialStoreData: SxSStoreData = createInitialStoreData();
        getStore().sxsStoreMapping.set(sxsId, initialStoreData);
    }
    return getStore().sxsStoreMapping.get(sxsId);
}
