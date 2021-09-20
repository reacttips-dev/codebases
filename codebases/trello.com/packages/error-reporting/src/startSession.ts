import { Analytics } from '@trello/atlassian-analytics';
import { desktopVersion, clientVersion } from '@trello/config';
import { isBrowserSupported, isDesktop, browserStr } from '@trello/browser';

import { getChannel } from './getChannel';
import { getSessionId } from './getSessionId';

export const startSession = async () => {
  const channel = await getChannel();

  Analytics.sendOperationalEvent({
    source: 'appStartup',
    action: 'started',
    actionSubject: 'session',
    attributes: {
      channel,
      clientVersion,
      trelloSessionId: getSessionId(),
      isBrowserSupported: isBrowserSupported(),
      browser: browserStr,
      isDesktop: isDesktop(),
      desktopVersion: desktopVersion,
    },
  });
};
