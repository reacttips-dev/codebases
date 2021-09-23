'use es6';

import { combineReducers } from 'redux';
import { pubSubClient } from 'conversations-internal-pub-sub/redux/reducers/pubSubClient';
import { subscriptions } from 'conversations-internal-pub-sub/redux/reducers/subscriptions';
import widgetData from '../widget-data/reducers/widgetData';
import visitorIdentity from '../visitor-identity/reducers/visitorIdentity';
import widgetUi from '../widget-ui/reducers/widgetUi';
import emailCapture from '../email-capture/emailCaptureReducer';
import availabilityMessageTimeouts from '../availability/reducers/availabilityMessageTimeouts';
import clientData from '../client-data/reducers/clientData';
import responders from '../responders/reducers/responders';
import visitorThreadHistories from '../thread-histories/reducers/visitorThreadHistories';
import typingStates from '../typing-indicators/reducers/typingStatesReducer';
import fileUploads from '../file-uploads/reducers/fileUploads';
import fileUploadsErrors from '../file-uploads/reducers/fileUploadsErrors';
import resolvedAttachments from '../resolved-attachments/reducers/resolvedAttachments';
import gdpr from '../gdpr/reducers/gdpr';
import currentView from '../current-view/reducers/currentView';
import initialMessageBubbleVisible from '../initial-message-bubble/reducers/initialMessageBubbleVisible';
import timeOnPageTrigger from '../time-on-page-trigger/reducers/timeOnPageTrigger';
import threads from '../threads/reducers/threads';
import cookieBannerOnExitVisible from '../visitor-identity/reducers/cookieBannerOnExitVisible';
import selectedThreadId from '../selected-thread/reducers/selectedThreadId';
import unpublishedMessages from '../pubsub/reducers/unpublishedMessages';
import { stagedThread } from '../thread-create/reducers/stagedThread';
import widgetInputFocusStatus from '../visitor-widget/reducers/widgetInputFocusStatus';
import messageEditorStaging from '../message-editor/reducers/messageEditorStaging';
export default combineReducers({
  typingStates: typingStates,
  availabilityMessageTimeouts: availabilityMessageTimeouts,
  clientData: clientData,
  cookieBannerOnExitVisible: cookieBannerOnExitVisible,
  currentView: currentView,
  emailCapture: emailCapture,
  fileUploads: fileUploads,
  fileUploadsErrors: fileUploadsErrors,
  gdpr: gdpr,
  initialMessageBubbleVisible: initialMessageBubbleVisible,
  messageEditorStaging: messageEditorStaging,
  pubSubClient: pubSubClient,
  resolvedAttachments: resolvedAttachments,
  responders: responders,
  selectedThreadId: selectedThreadId,
  stagedThread: stagedThread,
  subscriptions: subscriptions,
  threadHistories: visitorThreadHistories,
  threads: threads,
  timeOnPageTrigger: timeOnPageTrigger,
  unpublishedMessages: unpublishedMessages,
  visitorIdentity: visitorIdentity,
  widgetData: widgetData,
  widgetInputFocusStatus: widgetInputFocusStatus,
  widgetUi: widgetUi
});