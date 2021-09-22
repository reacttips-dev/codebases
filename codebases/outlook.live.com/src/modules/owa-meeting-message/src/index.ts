import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MeetingMessage"*/ './lazyIndex')
);

// Export types and schema
export type { MeetingRequestViewState } from './store/schema/MeetingRequestViewState';
export { default as deleteMeetingMessage } from './actions/deleteMeetingMessage';
export { default as meetingMessageAddToCalendarStatusChanged } from './actions/meetingMessageAddToCalendarStatusChanged';
export { default as MeetingMessageAddToCalendarStatus } from './store/schema/MeetingMessageAddToCalendarStatus';
export type { MeetingMessageActionType } from './utils/MeetingMessageActionType';
export type { MeetingRequestViewStateHost } from './store/schema/MeetingRequestViewState';

// Synchronous utilities
export { default as isMeetingMessage } from './utils/isMeetingMessage';
export { default as isMeetingRequest } from './utils/isMeetingRequest';
export { default as isMeetingResponse } from './utils/isMeetingResponse';
export { default as isMeetingCancellation } from './utils/isMeetingCancellation';
export { default as isMeetingMessageForSeriesMaster } from './utils/isMeetingMessageForSeriesMaster';
export { default as isMeetingMessageForSingleEvent } from './utils/isMeetingMessageForSingleEvent';
export { default as isMeetingMessageForSeriesException } from './utils/isMeetingMessageForSeriesException';

// Lazy-load actions
export const lazyAddItemToCalendar = new LazyAction(lazyModule, m => m.addItemToCalendar);

export const lazyInitializeMeetingRequestViewState = new LazyAction(
    lazyModule,
    m => m.initializeMeetingRequestViewStateAction
);

export const lazyRemoveCancelledMeetingFromCalendar = new LazyAction(
    lazyModule,
    m => m.removeCancelledMeetingFromCalendar
);

// Lazy-load components
export const MeetingMessageInfo = createLazyComponent(lazyModule, m => m.MeetingMessageInfo);
export const MeetingRequestActions = createLazyComponent(lazyModule, m => m.MeetingRequestActions);
export const MeetingCancellationAction = createLazyComponent(
    lazyModule,
    m => m.MeetingCancellationAction
);
export const MeetingActionButton = createLazyComponent(lazyModule, m => m.MeetingActionButton);
export const MeetingDetailsTime = createLazyComponent(lazyModule, m => m.MeetingDetailsTime);
export const MeetingDetailsLocation = createLazyComponent(
    lazyModule,
    m => m.MeetingDetailsLocation
);
export const MeetingRequestInfo = createLazyComponent(lazyModule, m => m.MeetingRequestInfo);

export const MeetingRequestResponseEditor = createLazyComponent(
    lazyModule,
    m => m.MeetingRequestResponseEditor
);

export const MeetingDetails = createLazyComponent(lazyModule, m => m.MeetingDetails);
export const MeetingRequestConflicts = createLazyComponent(
    lazyModule,
    m => m.MeetingRequestConflicts
);
export const EditEventLink = createLazyComponent(lazyModule, m => m.EditEventLink);
export const MeetingMessageSummary = createLazyComponent(lazyModule, m => m.MeetingMessageSummary);
export const PreviewSummary = createLazyComponent(lazyModule, m => m.PreviewSummary);
export const SenderSummary = createLazyComponent(lazyModule, m => m.SenderSummary);
export const CollapsedMeetingMessage = createLazyComponent(
    lazyModule,
    m => m.CollapsedMeetingMessage
);
export const MeetingIcon = createLazyComponent(lazyModule, m => m.MeetingIcon);

// Lazy-load utilities
export const lazyLogMeetingMessageActionForInvite = new LazyAction(
    lazyModule,
    m => m.logMeetingMessageActionForInvite
);
export const lazyLogMeetingMessageActionForEvent = new LazyAction(
    lazyModule,
    m => m.logMeetingMessageActionForEvent
);
