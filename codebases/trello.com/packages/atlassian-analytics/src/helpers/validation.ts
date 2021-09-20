/* eslint-disable @typescript-eslint/ban-types */
// ^ To use Function type; otherwise we'd have to define params

import {
  UIEvent,
  ScreenEvent,
  TrackEvent,
} from '@atlassiansox/analytics-web-client';
import {
  sendViewedComponentEvent,
  sendClickedButtonEvent,
  sendClickedLinkEvent,
  sendPressedShortcutEvent,
  sendCreatedBoardEvent,
  sendCopiedBoardEvent,
  sendDismissedComponentEvent,
  sendClosedComponentEvent,
  sendViewedBannerEvent,
} from './helperFunctions';

const sendError = (e: UIEvent | TrackEvent, helperFunction: Function) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `The event <${e.action} ${e.actionSubject} ${e.actionSubjectId}> must be replaced by the Analytics.${helperFunction.name} helper. See packages/atlassian-analytics/src/helpers for more information.`,
    );
  }
};
const sendScreenError = (e: ScreenEvent, helperFunction: Function) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `The <viewed ${e.name}> screen event must be replaced by the Analytics.${helperFunction.name} helper, as it is not a screen, modal, drawer, or inline dialog. Analytics.${helperFunction.name} will correctly fire a UI event (instead of a screen event). See packages/atlassian-analytics/src/helpers for more information.`,
    );
  }
};
const sendComponentWarning = (
  e: UIEvent | TrackEvent,
  helperFunction: Function,
) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `Are you tracking a ${e.action} UI component in the <${e.action} ${e.actionSubject}> event? If so, please use the Analytics.${helperFunction.name} helper. See packages/atlassian-analytics/src/helpers for more information.`,
    );
  }
};

export const checkForScreenHelper = (e: ScreenEvent) => {
  // Return boolean to prevent invalid screen events from firing
  const screenName = e.name.toLowerCase();
  if (screenName.includes('banner')) {
    sendScreenError(e, sendViewedBannerEvent);
    return sendViewedBannerEvent.name;
  } else if (!/screen|modal|drawer|inlinedialog/.test(screenName)) {
    sendScreenError(e, sendViewedComponentEvent);
    return sendViewedComponentEvent.name;
  }
};

export const checkForHelper = (e: UIEvent | TrackEvent) => {
  // Surface error when dev should be instrumenting with a helper instead of a raw event

  // Click events
  if (e.action === 'clicked' && e.actionSubject === 'button') {
    sendError(e, sendClickedButtonEvent);
    return sendClickedButtonEvent.name;
  }
  if (e.action === 'clicked' && e.actionSubject === 'link') {
    sendError(e, sendClickedLinkEvent);
    return sendClickedLinkEvent.name;
  }

  // Keyboard shortcuts; catching "shortcut" and "keyboardShortcut"
  if (e.actionSubject.toLowerCase().includes('shortcut')) {
    sendError(e, sendPressedShortcutEvent);
    return sendPressedShortcutEvent.name;
  }

  // Board create + copy
  if (e.action === 'created' && e.actionSubject === 'board') {
    sendError(e, sendCreatedBoardEvent);
    return sendCreatedBoardEvent.name;
  }
  if (e.action === 'copied' && e.actionSubject === 'board') {
    sendError(e, sendCopiedBoardEvent);
    return sendCopiedBoardEvent.name;
  }

  // Warnings for UI component helper checks, since action could be dual purpose.
  // If your event doesn't meet the warning criteria, disable the warning with a
  // "eslint-disable-next-line no-console" comment.
  if (e.action === 'dismissed') {
    sendComponentWarning(e, sendDismissedComponentEvent);
    return sendDismissedComponentEvent.name;
  }
  if (e.action === 'closed') {
    sendComponentWarning(e, sendClosedComponentEvent);
    return sendClosedComponentEvent.name;
  }
};
