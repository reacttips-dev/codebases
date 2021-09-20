import { sendErrorEvent, SentryErrorMetadata } from './sendErrorEvent';
import { TracedError } from '@trello/atlassian-analytics';

/**
 * Sends a crash metric (operational event) via our analytics client
 * and also sends the error along to our Sentry endpoint
 */
export const sendCrashEvent = async (
  error: TracedError,
  metadata: SentryErrorMetadata = {
    tags: {},
    extraData: {},
  },
) => {
  // TODO: not this!
  //
  // See: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
  //
  // We started seeing this error a few weeks ago, it's believed to be benign
  // but happens at a high frequency which results in alerts in web. We're
  // opting to mute it for now, because the usages of ResizeObserver are all in
  // 3rd-party dependencies
  if (error.message.includes('ResizeObserver loop limit exceeded')) {
    return;
  }

  sendErrorEvent(error, metadata, true);
};
