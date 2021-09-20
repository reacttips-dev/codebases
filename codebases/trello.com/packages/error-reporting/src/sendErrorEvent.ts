import {
  Analytics,
  getScreenFromUrl,
  TracedError,
} from '@trello/atlassian-analytics';
import { desktopVersion, clientVersion } from '@trello/config';
import { isBrowserSupported, isDesktop, asString } from '@trello/browser';
import { memberId } from '@trello/session-cookie';
import { withScope, captureException } from '@sentry/browser';
import { NetworkError } from '@trello/graphql-error-handling';
import { getSessionId } from './getSessionId';
import { getChannel } from './getChannel';
import { featureFlagClient } from '@trello/feature-flag-client';
import { scrubMessage } from '@trello/strings';
import { getLocation } from '@trello/router';

interface LegacyNavigator extends Navigator {
  browserLanguage: string;
}

interface SentryEntry {
  name: string;
  msg: string;
  stack?: string;
  ua: string;
  browser: string;
  isBrowserSupported: boolean;
  language: string;
  clientVersion: { head: string; version: number; patch: number };
  tags: {
    [key: string]: boolean | string;
  };
  extra: {
    [key: string]: boolean | string;
  };
  sentryEventId: string | null;
  idMember?: string;
}

interface SentryOwnershipTags {
  ownershipArea?:
    | 'trello-aaaa'
    | 'trello-ahaa'
    | 'trello-billing-platform'
    | 'trello-bizteam'
    | 'trello-data-eng'
    | 'trello-ecosystem'
    | 'trello-enterprise'
    | 'trello-fe-platform'
    | 'trello-nusku'
    | 'trello-panorama'
    | 'trello-teamplates'
    | 'trello-tofu'
    | 'trello-workflowers';
}

interface SentryTags {
  [key: string]: string;
}

interface SentryExtraData {
  [key: string]: string | boolean;
}

/**
 * SentryErrorMetadata defines additional error context
 * sent to Sentry. Tags are searchable entities, whereas
 * extraData is read-only data that can be viewed on the
 * error page.
 */
export interface SentryErrorMetadata {
  tags?: SentryOwnershipTags & SentryTags;
  extraData?: SentryExtraData;
  networkError?: NetworkError | null;
}

interface ErrorEventAttributes {
  name: string;
  msg: string;
  stack?: string;
  trelloSessionId: string;
  channel: string | null;
  clientVersion: string | null;
  sentryEventId: string | null;
  isBrowserSupported: boolean;
  browser: string;
  isDesktop: boolean;
  desktopVersion: string;
  taskId?: string;
  task?: string;
  language?: string;
  extra?: SentryExtraData;
  tags?: SentryOwnershipTags & SentryTags;
}

const replaceSlashInSentryTag = (tagKey: string): string => {
  // Sentry doesn't seem to like forward slashes in tag keys.
  // This replaces all instances of them with dashes.
  return tagKey.replace(/\//g, '-');
};

const displayErrorInConsole = (data: SentryEntry) => {
  const { hostname } = getLocation();

  if (hostname !== 'trello.com') {
    console.error(data);
  }
};

/**
 * Sends an error entry to Sentry, to GAS, and to LaaS via /err in Server
 *
 * @param errorEvent the errorEvent to send to Sentry
 */
export const sendErrorEvent = async (
  error: TracedError,
  metadata: SentryErrorMetadata = {
    tags: {},
    extraData: {},
  },
  isCrash: boolean = false,
): Promise<void> => {
  const versionParts = clientVersion.split('-');
  const head = versionParts.slice(0, -1).join('-');
  const version = parseInt(versionParts.slice(-1)[0], 10);
  const memberProperty = memberId ? { idMember: memberId } : {};
  const language =
    navigator.language || (navigator as LegacyNavigator).browserLanguage;
  const isSanitizingPiiEnabled = featureFlagClient.get(
    'fep.sanitize-pii-in-errors',
    false,
  );
  let formattedNetworkError = {};
  if (metadata.networkError) {
    formattedNetworkError = {
      networkErrorCode: metadata.networkError?.code,
      networkErrorMessage: metadata.networkError?.message,
      networkErrorStatus: `${metadata.networkError?.status}`,
    };
  }

  if (isSanitizingPiiEnabled) {
    // Remove Private Information from the Error Message
    error.message = scrubMessage(error.message);
  }

  const taskPrefix = 'task_';
  // Explicit VitalStats tracing: an error has a traceId and task
  if (error.traceId && error.taskName && metadata.tags) {
    const taskName = error.taskName;
    const sentryKey = replaceSlashInSentryTag(`${taskPrefix}${taskName}`);
    metadata.tags[sentryKey] = error.traceId;
  }

  // Implicit VitalStats tracing: an error occured during one or more tasks
  const taskSessions = Analytics.getTaskSessions();
  if (metadata.tags) {
    for (const task in taskSessions) {
      const sentryKey = replaceSlashInSentryTag(`${taskPrefix}${task}`);
      metadata.tags[sentryKey] = taskSessions[task];
    }
  }

  const extra = {
    ...formattedNetworkError,
    ...metadata.extraData,
  };

  let sentryEventId: string | null = null;
  // Send the error to the Atlassian internal sentry
  withScope((scope) => {
    if (metadata.tags) {
      scope.setTags(metadata.tags);
    }
    if (extra) {
      scope.setExtras(extra);
    }
    sentryEventId = captureException(error);
  });

  // Send to the /err endpoint
  const entry: SentryEntry = {
    name: error.name,
    msg: error.message,
    stack: error.stack,
    ua: navigator.userAgent,
    browser: asString,
    isBrowserSupported: isBrowserSupported(),
    language,
    clientVersion: { head, version, patch: 0 },
    tags: {
      isBrowserSupported: isBrowserSupported(),
      ...(metadata.tags as SentryTags),
    },
    extra,
    sentryEventId,
    // Only append the idMember property if there's a memberId.
    ...memberProperty,
  };

  displayErrorInConsole(entry);

  const attributes: ErrorEventAttributes = {
    name: error.name,
    msg: error.message,
    stack: error.stack,
    trelloSessionId: getSessionId(),
    channel: await getChannel(),
    clientVersion,
    sentryEventId,
    isBrowserSupported: isBrowserSupported(),
    browser: asString,
    isDesktop: isDesktop(),
    desktopVersion,
    language,
    extra,
    tags: metadata.tags,
  };

  if (error.traceId) {
    attributes.taskId = error.traceId;
  }

  if (error.taskName) {
    attributes.task = error.taskName;
  }

  Analytics.sendOperationalEvent({
    source: getScreenFromUrl(),
    action: isCrash ? 'crashed' : 'errored',
    actionSubject: 'app',
    attributes,
  });
};
