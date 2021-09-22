import type { ClientAttachmentId } from 'owa-client-ids';
import type EventEmitter from 'owa-event-emitter';
import type { MeetingMessageAddToCalendarStatus } from 'owa-meeting-message';
import type { SxSViewState } from 'owa-sxsdata';
import type PendingOperationState from './PendingOperationState';
import type SigsInfo from './SigsInfo';
import type SxSEditState from './SxSEditState';
import type SxSExtendedViewState from './SxSExtendedViewState';
import type SxSReadingPaneState from './SxSReadingPaneState';
import type { ObservableMap } from 'mobx';

export const SXSID_MAIN_WINDOW: string = 'sxsIdMainWindow';
export const SXSV2_CONTAINER_ID: string = 'owaSxSV2';

export enum SxSCustomization {
    Mail,
    FilesHub,
    DeepLink,
    GroupFilesHub,
    PopOut /* SxS that is popped out from itself */,
}

export interface SxSStoreData {
    shouldShow: boolean;
    viewState: SxSViewState;
    extendedViewState: SxSExtendedViewState;
    editState: SxSEditState;
    customPreviewState: any;
    eventManager: EventEmitter;
    pendingPreviewOperation: PendingOperationState;
    pendingNavigation: { toAttachmentId: ClientAttachmentId; triggerTime: number };

    readingPaneState: SxSReadingPaneState;
    composeId: string;
    customization: SxSCustomization;
    isInvisible: boolean;

    shouldUseFakeRightHandSide: boolean;
    isUsingFakeRightHandSide: boolean;

    attachmentViewStateIdFromListView: string;

    sessionPreviewCount: number;
    sessionStartTime: number;

    meetingMessageAddToCalendarStatus: MeetingMessageAddToCalendarStatus;

    sigsInfo: null | SigsInfo;
}

export interface SxSStore {
    sxsStoreMapping: ObservableMap<string, SxSStoreData>;
}
