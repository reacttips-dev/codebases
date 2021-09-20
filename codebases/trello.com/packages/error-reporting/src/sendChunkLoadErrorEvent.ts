import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { getChannel } from './getChannel';
import { getSessionId } from './getSessionId';
import { desktopVersion } from '@trello/config';
import { isBrowserSupported, browserStr } from '@trello/browser';
export const sendChunkLoadErrorEvent = async (error: Error) => {
  const channel = await getChannel();
  const source = getScreenFromUrl();

  Analytics.sendOperationalEvent({
    source,
    action: 'errored',
    actionSubject: 'chunkLoad',
    attributes: {
      trelloSessionId: getSessionId(),
      channel,
      isBrowserSupported: isBrowserSupported(),
      browser: browserStr,
      desktopVersion: desktopVersion,
      stack: error.stack,
      name: 'HandledChunkLoadError',
    },
  });
};
